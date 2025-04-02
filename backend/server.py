from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import os
import json
import shutil
from weedout import preprocess
from pathlib import Path
import time
from dotenv import load_dotenv
import os


app = Flask(__name__)
CORS(app)

# Fix directory structure - move OUTSIDE the backend folder
BASE_DIR = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))  # Go up one level
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER")
PROCESSED_FOLDER = os.getenv("PROCESSED_FOLDER")
PUBLIC_FILES_FOLDER = os.getenv("PUBLIC_FILES_FOLDER")

# Print directories at startup for debugging
print(f"BASE_DIR: {BASE_DIR}")
print(f"UPLOAD_FOLDER: {UPLOAD_FOLDER}")
print(f"PROCESSED_FOLDER: {PROCESSED_FOLDER}")
print(f"PUBLIC_FILES_FOLDER: {PUBLIC_FILES_FOLDER}")

# Create directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs(PUBLIC_FILES_FOLDER, exist_ok=True)

# Improved file removal function with retry logic
def safe_remove_file(file_path):
    # Convert to string to handle both string and Path objects
    file_path_str = str(file_path)
    if not os.path.exists(file_path_str):
        print(f"File does not exist: {file_path_str}")
        return True
    
    max_attempts = 3
    for attempt in range(max_attempts):
        try:
            os.remove(file_path_str)
            print(f"Successfully removed file: {file_path_str}")
            return True
        except PermissionError:
            print(f"Permission error when removing {file_path_str}, attempt {attempt+1}/{max_attempts}")
            time.sleep(0.5)  # Wait briefly to allow any file locks to be released
        except Exception as e:
            print(f"Error removing file {file_path_str}: {e}")
            return False
    
    print(f"Failed to remove file after {max_attempts} attempts: {file_path_str}")
    return False

@app.route("/", methods=["GET"])
def return_home():
    return jsonify({"message": "it works!" })

@app.route("/process", methods=["POST"])
def process_file():
    # Add these debug lines
    print(f"Current working directory: {os.getcwd()}")
    print(f"Request received with files: {request.files}")
    print(f"Request form data: {request.form}")
    
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    original_filename = file.filename
    
    print(f"Processing file: {original_filename}")
    
    # Ensure all directories exist again (in case they were manually deleted)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(PROCESSED_FOLDER, exist_ok=True)
    os.makedirs(PUBLIC_FILES_FOLDER, exist_ok=True)
    
    # Use absolute paths for all file operations
    file_path = os.path.join(UPLOAD_FOLDER, original_filename)
    public_original_path = os.path.join(PUBLIC_FILES_FOLDER, "file.csv")
    public_processed_path = os.path.join(PUBLIC_FILES_FOLDER, "file_processed.csv")
    
    # Save uploaded file
    try:
        file.save(file_path)
        print(f"Saved uploaded file to: {file_path}")
        
        # Verify the file exists
        if os.path.exists(file_path):
            print(f"Verified: Original file saved at {file_path}")
            print(f"File size: {os.path.getsize(file_path)} bytes")
        else:
            print(f"ERROR: Original file was not saved to {file_path}")
            return jsonify({"error": "Failed to save uploaded file"}), 500
    except Exception as e:
        print(f"Error saving uploaded file: {e}")
        return jsonify({"error": f"Error saving uploaded file: {str(e)}"}), 500
    
    # Remove existing files if they exist
    safe_remove_file(public_original_path)
    safe_remove_file(public_processed_path)
    
    # Copy file to public folder with error handling
    try:
        # Ensure the directory exists again (in case it was deleted)
        os.makedirs(os.path.dirname(public_original_path), exist_ok=True)
        
        shutil.copy2(file_path, public_original_path)
        print(f"Copied file to public folder: {public_original_path}")
        
        # Verify copy succeeded
        if os.path.exists(public_original_path):
            print(f"Verified: File copied to {public_original_path}")
            print(f"File size: {os.path.getsize(public_original_path)} bytes")
        else:
            print(f"ERROR: File was not copied to {public_original_path}")
    except Exception as e:
        print(f"Error copying to public folder: {e}")
        # Continue processing even if copy fails
    
    # Check file size and potentially downsample for large files
    try:
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
                print(f"Downsampled large file for preview: {sample_size} rows")
            except Exception as e:
                print(f"Warning: Could not downsample large file: {e}")
    except Exception as e:
        print(f"Error checking file size: {e}")
        # Continue processing even if this fails

    # SIMPLIFIED USER OPTIONS
    # 1. Model type: regression (0) or classification (1)
    model_type_int = int(request.form.get("model_type", 1))
    
    # 2. Critical fix: Convert sampling to the integer value that the preprocess module expects
    # Get the integer value of sampling directly, which is what the module expects
    sampling_int = int(request.form.get("sampling", 0))
    
    # Map the integer to the correct string for logging and response
    sampling_strategy_map = {
        0: "none",
        1: "undersampling",
        2: "oversampling", 
        3: "smote"
    }
    
    # For display and logging
    sampling_strategy = sampling_strategy_map.get(sampling_int, "none")
    
    # Log the sampling values with clear differentiation
    print(f"⚠️ SAMPLING INT (what preprocess gets): {sampling_int}")
    print(f"⚠️ SAMPLING STRATEGY (display name): {sampling_strategy}")
    
    # 3. Dataset type: cross-sectional (0) or time-series (1)
    dataset_type_int = int(request.form.get("dataset_type", 0))
    
    # 4. Column selections
    target_column = request.form.get("target_column", "")
    drop_columns = json.loads(request.form.get("drop_columns", "[]"))
    untouched_columns = json.loads(request.form.get("untouched_columns", "[]"))

    print(f"Processing with options: model_type={model_type_int}, sampling={sampling_int}, dataset_type={dataset_type_int}")
    print(f"Target column: {target_column}")
    print(f"Columns to drop: {drop_columns}")
    print(f"Untouched columns: {untouched_columns}")

    try:
        # Call preprocess_pipeline with the integer sampling value
        # This is the critical fix - passing the sampling value as an integer
        if sampling_strategy != "none":
            processed_df = preprocess.preprocess_pipeline(
                file_path=file_path,
                target_column=target_column,
                dropped_columns=drop_columns,
                untouched_columns=untouched_columns,
                type_dataset=dataset_type_int,
                sampling=sampling_int,
                classfication=model_type_int
            )
        else:
            processed_df = preprocess.preprocess_pipeline(
            file_path=file_path,
            target_column=target_column,
            dropped_columns=drop_columns,
            untouched_columns=untouched_columns,
            type_dataset=dataset_type_int,
            sampling=sampling_int,
            classfication=model_type_int,
            strategy_sample=sampling_strategy,
        )
        
        print(f"Processing complete: {len(processed_df)} rows in result")
        
        # Save processed file with consistent path handling
        processed_filename = f"processed_{original_filename}"
        processed_file_path = os.path.join(PROCESSED_FOLDER, processed_filename)
        
        # Make sure the processed folder exists (double check)
        os.makedirs(PROCESSED_FOLDER, exist_ok=True)
        
        # Save with absolute path to ensure correct location
        processed_df.to_csv(processed_file_path, index=False)
        print(f"Saved processed file to: {processed_file_path}")
        
        # Verify the file exists after saving
        if os.path.exists(processed_file_path):
            print(f"Verified: File exists at {processed_file_path}")
            print(f"File size: {os.path.getsize(processed_file_path)} bytes")
        else:
            print(f"ERROR: File was not saved to {processed_file_path}")
            return jsonify({"error": "Failed to save processed file"}), 500
        
        # Ensure the destination path is available
        safe_remove_file(public_processed_path)
        
        # Make sure public files folder exists again
        os.makedirs(os.path.dirname(public_processed_path), exist_ok=True)
        
        # Save processed data to public folder with better error handling
        try:
            if len(processed_df) > 10000:
                processed_df.sample(10000).to_csv(public_processed_path, index=False)
                print(f"Saved downsampled processed file (10000 rows) to public folder")
            else:
                processed_df.to_csv(public_processed_path, index=False)
                print(f"Saved full processed file to public folder")
            
            # Verify this file exists too
            if os.path.exists(public_processed_path):
                print(f"Verified: Processed file saved to {public_processed_path}")
                print(f"File size: {os.path.getsize(public_processed_path)} bytes")
            else:
                print(f"ERROR: Processed file was not saved to {public_processed_path}")
        except Exception as e:
            print(f"Error saving processed file to public folder: {e}")
            # Continue since we already saved to the processed folder

        # Clean up original file
        safe_remove_file(file_path)

        # Prepare options for localStorage on frontend
        options_used = {
            "model_type": model_type_int,
            "sampling": sampling_strategy,  # Use the string representation for UI display
            "dataset_type": dataset_type_int,
            "target_column": target_column,
            "columns_dropped": len(drop_columns),
            "columns_untouched": len(untouched_columns)
        }
        
        print(f"Returning success response with filename: {processed_filename}")
        print(f"Options used: {options_used}")

        return jsonify({
            "message": "File processed successfully", 
            "filename": processed_filename,
            "downsample_warning": downsample_warning,
            "options_used": options_used
        }), 200

    except Exception as e:
        import traceback
        print(f"Error processing file: {str(e)}")
        print(traceback.format_exc())  # Print full traceback for debugging
        return jsonify({"error": str(e)}), 500

@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    try:
        # Make sure the processed folder exists before attempting to list files
        os.makedirs(PROCESSED_FOLDER, exist_ok=True)
        
        # Log the attempted filename
        print(f"Attempting to download file: {filename}")
        
        # List all files in the processed folder to help debug
        processed_files = os.listdir(PROCESSED_FOLDER)
        print(f"Files in processed folder: {processed_files}")

        file_path = os.path.join(PROCESSED_FOLDER, filename)
        
        # Additional logging
        print(f"Full file path: {file_path}")
        print(f"File exists: {os.path.exists(file_path)}")
        
        if not os.path.exists(file_path):
            # Try with "processed_" prefix if it's not there already
            if not filename.startswith("processed_"):
                prefixed_filename = f"processed_{filename}"
                prefixed_path = os.path.join(PROCESSED_FOLDER, prefixed_filename)
                if os.path.exists(prefixed_path):
                    print(f"Found file with 'processed_' prefix: {prefixed_path}")
                    return send_file(prefixed_path, as_attachment=True)
            
            # If still not found, try a more flexible search
            matching_files = [f for f in processed_files if filename in f]
            if matching_files:
                file_path = os.path.join(PROCESSED_FOLDER, matching_files[0])
                print(f"Found matching file: {file_path}")
            else:
                return jsonify({"error": f"File not found: {filename}", "processed_files": processed_files}), 404
        
        return send_file(file_path, as_attachment=True)
    
    except Exception as e:
        print(f"Error downloading file: {e}")
        return jsonify({"error": str(e)}), 500

# Add a route to check if files exist (for debugging)
@app.route("/check-files", methods=["GET"])
def check_files():
    try:
        # Ensure directories exist before checking
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(PROCESSED_FOLDER, exist_ok=True)
        os.makedirs(PUBLIC_FILES_FOLDER, exist_ok=True)
        
        public_original = os.path.join(PUBLIC_FILES_FOLDER, "file.csv")
        public_processed = os.path.join(PUBLIC_FILES_FOLDER, "file_processed.csv")
        
        processed_files = os.listdir(PROCESSED_FOLDER) if os.path.exists(PROCESSED_FOLDER) else []
        public_files = os.listdir(PUBLIC_FILES_FOLDER) if os.path.exists(PUBLIC_FILES_FOLDER) else []
        
        return jsonify({
            "public_original_exists": os.path.exists(public_original),
            "public_processed_exists": os.path.exists(public_processed),
            "processed_folder_files": processed_files,
            "public_folder_files": public_files,
            "working_directory": os.getcwd(),
            "base_dir": BASE_DIR
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)