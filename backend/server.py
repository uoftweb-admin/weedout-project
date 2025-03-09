import io
import zipfile
import os
from flask import Flask, render_template, redirect, url_for, session, send_file, after_this_request
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, SubmitField, RadioField
from wtforms.validators import DataRequired, InputRequired, Length
from flask_bootstrap import Bootstrap
import pandas as pd
from io import BytesIO
from contextlib import redirect_stdout
from weedout import preprocess
import tempfile


app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  
Bootstrap(app)

def make_array(string: str):
    return [i.strip() for i in string.split(',')]

class NameForm(FlaskForm):

    data_type = RadioField('Dataset Type', choices=[('0', 'Cross-Sectional Data'), ('1', 'Time Series Data')], validators=[DataRequired()])

    model_type = RadioField('Model Type for which the data is being trained on', choices=[('0','Regression'),('1','Classification')], validators=[DataRequired()])

    sampling_response = RadioField('Should we perform sampling if needed? (Read Note before selecting options)', choices=[('1','Yes'),('0','No')], validators=[DataRequired()])

    strategy_sample = RadioField('What kind of sampling should we perform?', 
                                 choices=[('smote','smote'),
                                          ('undersampling','undersampling'), 
                                          ('oversampling','oversampling'), 
                                          ('no sampling','no sampling')], validators=[DataRequired()])
    
    target_name  = StringField('Name of the Target Column', validators=[InputRequired(), Length(min=1, max=30)])

    dropped_column = StringField('Name of the columns to drop from the dataset. (Seprate each column name with a comma)', validators=[Length(max=200)])

    untouched_column = StringField('Name of the columns to not scale/encode in the dataset. (Seprate each column name with a comma)', validators=[Length(max=200)])

    csv_file = FileField('Upload CSV File', validators=[FileAllowed(['csv'], 'CSV files only!')])

    submit = SubmitField('Submit')


@app.errorhandler(400)
@app.errorhandler(500)
def handle_error(error):
    return render_template('error.html')

@app.route('/', methods=['GET'])
def landing():
    return render_template('landing.html')

@app.route('/about', methods =['GET'])
def about():
    return render_template('about.html')

@app.route('/documentation', methods=['GET'])
def documentation():
    return render_template('documentation.html')

@app.route('/preprocess', methods=['GET', 'POST'])
def index():
    form = NameForm()
    if form.validate_on_submit():
        if form.csv_file.data:
            session['data_type'] = form.data_type.data
            session['model_type'] = form.model_type.data
            session['sampling_response'] = form.sampling_response.data
            session['strategy_sample'] = form.strategy_sample.data
            session['target_name'] = form.target_name.data
            session['dropped_column'] = form.dropped_column.data
            session['untouched_column'] = form.untouched_column.data
            
            # Read the CSV file and store its content as a string in the session
            csv_content = form.csv_file.data.read().decode('utf-8')

            if csv_content:
                # Define the path to your temp folder
                temp_folder_path = 'temp/'

                # Ensure the temp folder exists
                os.makedirs(temp_folder_path, exist_ok=True)

                # Define the full path to the CSV file
                csv_file_path = os.path.join(temp_folder_path, 'data.csv')

                # Write the CSV content to the file
                with open(csv_file_path, 'w') as csv_file:
                    csv_file.write(csv_content)

            return redirect(url_for('result'))
        
    return render_template('index.html', form=form)


@app.route('/download_zip')
def download_zip():
    file_path = os.path.abspath('temp/data_final.csv')
    if not os.path.exists(file_path):
        return render_template('error.html', message="failed")

    @after_this_request
    def cleanup(response):
        try:
            os.remove('temp/data.csv')
            os.remove('temp/data_final.csv')
        except FileNotFoundError:
            pass
        return response
    
    memory_file = BytesIO()
    
    with zipfile.ZipFile(memory_file, 'w') as zf:
        if os.path.exists('temp/data_final.csv'):
            zf.write('temp/data_final.csv', 'data.csv')
        else:
            return render_template('error.html'), 404
    
    # Move to the beginning of the BytesIO object
    memory_file.seek(0)

    # Send the file for download
    return send_file(
        memory_file,
        mimetype='application/zip',
        as_attachment=True,
        download_name='archive.zip'
    )


@app.route('/results', methods=['GET','POST'])
def result():

    try:
        df = pd.read_csv('temp/data.csv')
        df_post = None
        target_column = session.get('target_name')
        dropped_columns = make_array(session.get('dropped_column'))
        untouched_columns = make_array(session.get('untouched_column'))
        type_dataset = int(session.get('data_type'))
        sampling = int(session.get('sampling_response'))
        classification = int(session.get('model_type'))
        strategy_sample =session.get('strategy_sample')


        buffer = io.StringIO()
        with redirect_stdout(buffer):
            df.info()
        df_info = buffer.getvalue()

        buffer_post = io.StringIO()
        passed = False
        with redirect_stdout(buffer_post):
            try:
                if strategy_sample != "no sampling":
                    df_post = preprocess.preprocess_pipeline('temp/data.csv', target_column, dropped_columns, untouched_columns, type_dataset, sampling, classification, strategy_sample)
                else:
                    df_post = preprocess.preprocess_pipeline('temp/data.csv', target_column, dropped_columns, untouched_columns, type_dataset, sampling, classification)
                passed = True
            except Exception as e:
                print(f'Error : {e}')

        if passed: 
            df_post_process = buffer_post.getvalue()
            df_post.to_csv('temp/data_final.csv', index=False)

            # Capture df_post.info() output
            buffer_post_info = io.StringIO()
            with redirect_stdout(buffer_post_info):
                df_post.info()
            df_post_info = buffer_post_info.getvalue()
        
        else:
            df_post_process = buffer_post.getvalue()

            df_post = pd.DataFrame()
            df_post.to_csv('temp/data_final.csv', index=False)

            df_post_info = False


        return render_template('result.html', 
                            data_type=session.get('data_type'), 
                            strategy_sample = session.get('strategy_sample'),
                            model_type = session.get('model_type'),
                            sampling_response=session.get('sampling_response'),
                            target_name = session.get('target_name'),
                            dropped_column = dropped_columns,
                            csv_content=df_info,
                            csv_content_process=df_post_process,
                            csv_content_post = df_post_info)
    
    except FileNotFoundError:
        return render_template('error.html'), 500




if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)