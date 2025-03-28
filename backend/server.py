from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import os
import json
import shutil
from weedout import preprocess

app = Flask(__name__)
CORS(app)

# Original folders
UPLOAD_FOLDER = "temp"
PROCESSED_FOLDER = "processed"

# Create a public folder for frontend access - adjust this path to match your Next.js public folder
PUBLIC_FILES_FOLDER = "../frontend/public/files"  # Adjust this path based on your project structure

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs(PUBLIC_FILES_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def return_home():
    return jsonify({"message": "it works!" })

@app.route("/process", methods=["POST"])
def process_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    original_filename = file.filename
    
    # Save to original folders
    file_path = os.path.join(UPLOAD_FOLDER, original_filename)
    file.save(file_path)
    
    # Save a copy to public folder with standard name
    public_original_path = os.path.join(PUBLIC_FILES_FOLDER, "file.csv")
    print("\n\n\n\n\n\n DEBUGGGGGGG" + public_original_path + "\n\n\n\n\n\n DEBUGGGGGGG")
    shutil.copy2(file_path, public_original_path)
    
    # Check file size and potentially downsample for large files
    file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
    downsample_warning = False
    
    # If file is over 10MB, consider downsampling for preview
    if file_size_mb > 10:
        try:
            df = pd.read_csv(file_path)
            sample_size = min(10000, len(df))
            df_sample = df.sample(sample_size)
            df_sample.to_csv(public_original_path, index=False)
            downsample_warning = True
        except Exception as e:
            print(f"Warning: Could not downsample large file: {e}")

    # SIMPLIFIED USER OPTIONS
    # 1. Model type: regression (0) or classification (1)
    model_type_int = int(request.form.get("model_type", 1))
    
    # 2. Sampling type: none, oversample, undersample, or smote
    sampling_strategy = request.form.get("sampling_strategy", "none")
    
    # 3. Dataset type: cross-sectional (0) or time-series (1)
    dataset_type_int = int(request.form.get("dataset_type", 0))
    
    # 4. Column selections
    target_column = request.form.get("target_column", "")
    drop_columns = json.loads(request.form.get("drop_columns", "[]"))
    untouched_columns = json.loads(request.form.get("untouched_columns", "[]"))

    try:
        # Call preprocess_pipeline
        if sampling_strategy != "No sampling":
            processed_df = preprocess.preprocess_pipeline(
                file_path=file_path,
                target_column=target_column,
                dropped_columns=drop_columns,
                untouched_columns=untouched_columns,
                type_dataset=dataset_type_int,
                sampling=sampling_strategy,
                classfication=model_type_int
            )
        else:
            processed_df = preprocess.preprocess_pipeline(
                file_path=file_path,
                target_column=target_column,
                dropped_columns=drop_columns,
                untouched_columns=untouched_columns,
                type_dataset=dataset_type_int,
                sampling=sampling_strategy,
                classfication=model_type_int,
                strategy_sample=sampling_strategy,
            )
        
        # Save to processed folder with original name
        processed_filename = "processed_" + original_filename
        processed_file_path = os.path.join(PROCESSED_FOLDER, processed_filename)
        processed_df.to_csv(processed_file_path, index=False)
        
        # Save to public folder with standard name for frontend
        public_processed_path = os.path.join(PUBLIC_FILES_FOLDER, "file_processed.csv")
        
        # If processed file is large, save a sample for preview
        if len(processed_df) > 10000:
            processed_df.sample(10000).to_csv(public_processed_path, index=False)
        else:
            processed_df.to_csv(public_processed_path, index=False)

        # Clean up original file
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"Deleted original uploaded file: {file_path}")
            except Exception as e:
                print(f"Error deleting uploaded file: {e}")

        return jsonify({
            "message": "File processed successfully", 
            "filename": processed_filename,
            "downsample_warning": downsample_warning,
            "options_used": {
                "model_type": model_type_int,
                "sampling": sampling_strategy,
                "dataset_type": dataset_type_int,
                "target_column": target_column,
                "columns_dropped": len(drop_columns),
                "columns_untouched": len(untouched_columns)
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    file_path = os.path.join(PROCESSED_FOLDER, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    return send_file(file_path, as_attachment=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)