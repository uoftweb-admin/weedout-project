import os
import io
import zipfile
import tempfile
from flask import Flask, request, jsonify, session, send_file
import pandas as pd
from contextlib import redirect_stdout
from flask_cors import CORS
from weedout import preprocess  # your custom preprocessing function

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
CORS(app, supports_credentials=True)

def make_array(string: str):
    return [i.strip() for i in string.split(',') if i.strip()]

def parse_csv_file(file_storage):
    temp_folder = tempfile.mkdtemp()
    file_path = os.path.join(temp_folder, 'data.csv')
    file_storage.save(file_path)
    return file_path, temp_folder

@app.route('/api/preprocess', methods=['POST'])
def api_preprocess():
    # Validate file upload
    if 'csv_file' not in request.files:
        return jsonify({'error': 'No file provided.'}), 400
    file = request.files['csv_file']
    if file.filename == '':
        return jsonify({'error': 'No file selected.'}), 400

    # Retrieve parameters from form data
    data_type = request.form.get('data_type', '0')
    model_type = request.form.get('model_type', '0')
    sampling_response = request.form.get('sampling_response', '0')
    strategy_sample = request.form.get('strategy_sample', 'no sampling')
    target_name = request.form.get('target_name', '')
    dropped_column = request.form.get('dropped_column', '')
    untouched_column = request.form.get('untouched_column', '')

    try:
        type_dataset = int(data_type)
    except:
        type_dataset = 0
    try:
        sampling = int(sampling_response)
    except:
        sampling = 0
    try:
        classification = int(model_type)
    except:
        classification = 0

    dropped_columns = make_array(dropped_column)
    untouched_columns = make_array(untouched_column)

    # Save CSV to a temporary folder
    csv_file_path, temp_folder = parse_csv_file(file)

    # Get original CSV file info
    try:
        df = pd.read_csv(csv_file_path)
    except Exception as e:
        return jsonify({'error': f'Error reading CSV: {str(e)}'}), 400

    buffer = io.StringIO()
    with redirect_stdout(buffer):
        df.info()
    csv_info = buffer.getvalue()

    # Process the CSV file and capture logs
    try:
        buffer_process = io.StringIO()
        with redirect_stdout(buffer_process):
            if strategy_sample != "no sampling":
                df_post = preprocess.preprocess_pipeline(
                    csv_file_path,
                    target_name,
                    dropped_columns,
                    untouched_columns,
                    type_dataset,
                    sampling,
                    classification,
                    strategy_sample
                )
            else:
                df_post = preprocess.preprocess_pipeline(
                    csv_file_path,
                    target_name,
                    dropped_columns,
                    untouched_columns,
                    type_dataset,
                    sampling,
                    classification
                )
        logs = buffer_process.getvalue()

        # Save the processed CSV file
        processed_csv_path = os.path.join(temp_folder, 'data_final.csv')
        df_post.to_csv(processed_csv_path, index=False)
        buffer_post_info = io.StringIO()
        with redirect_stdout(buffer_post_info):
            df_post.info()
        csv_post_info = buffer_post_info.getvalue()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Store results in session for later retrieval
    session['results'] = {
        'data_type': data_type,
        'model_type': model_type,
        'sampling_response': sampling_response,
        'strategy_sample': strategy_sample,
        'target_name': target_name,
        'dropped_column': dropped_column,
        'untouched_column': untouched_column,
        'csv_content': csv_info,
        'csv_content_process': logs,
        'csv_content_post': csv_post_info,
        'temp_folder': temp_folder  # used to locate the processed file
    }
    return jsonify({'success': True}), 200

@app.route('/api/results', methods=['GET'])
def get_results():
    results = session.get('results')
    if not results:
        return jsonify({'error': 'No results found.'}), 404
    return jsonify(results)

@app.route('/download_zip', methods=['GET'])
def download_zip():
    results = session.get('results')
    if not results or 'temp_folder' not in results:
        return "No file to download.", 404
    temp_folder = results['temp_folder']
    processed_csv_path = os.path.join(temp_folder, 'data_final.csv')
    if not os.path.exists(processed_csv_path):
        return "Processed file not found.", 404

    memory_file = io.BytesIO()
    with zipfile.ZipFile(memory_file, 'w') as zf:
        zf.write(processed_csv_path, arcname='data.csv')
    memory_file.seek(0)
    return send_file(
        memory_file,
        mimetype='application/zip',
        as_attachment=True,
        download_name='archive.zip'
    )

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
