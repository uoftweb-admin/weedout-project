from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import os
import json
from weedout import preprocess

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "temp"
PROCESSED_FOLDER = "processed"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def return_home():
    return jsonify({"message": "it works!" })

@app.route("/process", methods=["POST"])
def process_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Retrieve preprocessing parameters from the request
    target_column = request.form.get("target_column", "")
    drop_columns = json.loads(request.form.get("drop_columns", "[]"))
    untouched_columns = json.loads(request.form.get("untouched_columns", "[]"))
    dataset_type = int(request.form.get("dataset_type", 0))
    sampling = int(request.form.get("sampling", 0))
    model_type = int(request.form.get("model_type", 1))
    sampling_strategy = request.form.get("sampling_strategy", "smote")

    try:
        # Call preprocess_pipeline
        if sampling_strategy != "No sampling":
            processed_df = preprocess.preprocess_pipeline(
                file_path=file_path,
                target_column=target_column,
                dropped_columns=drop_columns,
                untouched_columns=untouched_columns,
                type_dataset=dataset_type,
                sampling=sampling,
                classfication=model_type
            )
        else:
            processed_df = preprocess.preprocess_pipeline(
            file_path=file_path,
            target_column=target_column,
            dropped_columns=drop_columns,
            untouched_columns=untouched_columns,
            type_dataset=dataset_type,
            sampling=sampling,
            classfication=model_type,
            strategy_sample=sampling_strategy,
        )
        processed_filename = "processed_" + file.filename
        processed_file_path = os.path.join(PROCESSED_FOLDER, processed_filename)
        processed_df.to_csv(processed_file_path, index=False)
        return jsonify({"message": "File processed successfully", "filename": processed_filename}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Save processed file
    processed_filename = "processed_" + file.filename
    processed_file_path = os.path.join(PROCESSED_FOLDER, processed_filename)
    processed_df.to_csv(processed_file_path, index=False)

    return jsonify({"message": "File processed successfully", "filename": processed_filename}), 200

@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    file_path = os.path.join(PROCESSED_FOLDER, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    return send_file(file_path, as_attachment=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

