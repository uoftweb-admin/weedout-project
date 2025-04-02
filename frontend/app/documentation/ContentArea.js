// app/documentation/user-guide/ContentArea.jsx
import React from "react";
import CodeBlock from "./CodeBlock";
import { useRef } from "react";
import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "../UIProvider";
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import { Inria_Serif } from 'next/font/google';

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-inria-serif', 
});

hljs.registerLanguage('python', python);

  // ----------------------
  // 1) Define all content:
  // ----------------------
  const contentMap = {
    // Example top-level guide entry:
    // "10-minutes-to-weedout-content": (
    //   <div className={`${inriaSerif.className}`}>
    //     <h2 className={`text-2xl font-bold mb-4`}>10 minutes to weedout</h2>
    //     <p className={`mt-4`}>
    //       Weedout is a Python library that helps you preprocess your data and
    //       visualize it. It is an open-source library that is easy to use and has
    //       a wide range of features. It is built on top of pandas and matplotlib.
    //     </p>
    //     <p className="mt-4">
    //       In this guide, we will show you how to quickly get started with
    //       Weedout to preprocess your data and visualize it. We will cover:
    //     </p>
    //     <ul className="list-disc pl-6 mt-4">
    //       <li>Preprocessing data using Weedout</li>
    //       <li>Visualizing data using Weedout</li>
    //     </ul>
    //   </div>
    // ),

    // --------------------------------
    // weedout.preprocess  (functions)
    // --------------------------------

    "check_target_variable-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.check_target_variable</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          The function returns <code className={`${inriaSerif.className}`}>True</code> if the given target name exists
          in the dataframe. It returns <code className={`${inriaSerif.className}`} >False</code> if the target name is
          not in the dataframe.
        </p>
        <CodeBlock
          code={`def check_target_variable(df: pd.DataFrame, target_name: str) -> bool:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li >
            <code className={`${inriaSerif.className}`}>df (pd.DataFrame)</code> – The dataframe to check.
          </li>
          <li>
            <code className={`${inriaSerif.className}`}>target_name (str)</code> – The name of the target variable.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>bool</code> – <code className={`${inriaSerif.className}`}>True</code> if the target variable exists,
          otherwise <code className={`${inriaSerif.className}`}>False</code>.
        </p>
      </div>
    ),

    "check_duplicate_columns-content": (
      <div className={`${inriaSerif.className} font-sans`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.check_duplicate_columns</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function checks if the dataset (CSV file) has multiple columns
          with the same name. It returns a list of duplicate column names.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def check_duplicate_columns(file_path: str) -> List[str]:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>file_path (str)</code> – The path to the CSV file.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>List[str]</code> – A list of all duplicate column names in the
          dataset.
        </p>
      </div>
    ),

    "initial_check_dt-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.initial_check_dt</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          The function initially checks if the file provided is a valid CSV file
          that can be parsed. It checks and drops duplicate columns, verifies
          the target variable, and drops columns with exceedingly high null
          values while leaving untouched columns intact.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def initial_check_dt(file_path: str, target_variable: str, columns_to_drop: List[str]) -> Optional[pd.DataFrame]:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>file_path (str)</code> – The path to the CSV file.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>target_variable (str)</code> – The target column in the
            dataset.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>columns_to_drop (List[str])</code> – The list of columns that
            the user explicitly wants dropped from the dataset.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>Optional[pd.DataFrame]</code> – The modified dataframe if the
          function is successful; otherwise, <code className={`${inriaSerif.className}`}>None</code>.
        </p>
      </div>
    ),

    "cross_sectional_imputation-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.cross_sectional_imputation</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function performs imputation on a cross-sectional dataset.
          Numeric columns are imputed with their mean (average) value, while
          string/categorical columns are imputed with their mode (most frequent)
          value.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def cross_sectional_imputation(cross_sectional_df: pd.DataFrame, target_name: str) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>cross_sectional_df (pd.DataFrame)</code> – The dataframe
            (cross-sectional) with the target column included.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>target_name (str)</code> – The name of the target column.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>pd.DataFrame</code> – The modified dataframe after imputation.
        </p>
      </div>
    ),

    "time_series_imputation-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.time_series_imputation</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function performs imputation on a time-series dataset. Numeric
          columns are imputed via linear interpolation, while string/categorical
          columns are imputed with their mode (most frequent) value.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def time_series_imputation(time_series_df: pd.DataFrame, target_name: str) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>time_series_df (pd.DataFrame)</code> – The time series
            dataframe including the target column.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>target_name (str)</code> – The name of the target column.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>pd.DataFrame</code> – The modified dataframe after imputation.
        </p>
      </div>
    ),

    "handle_imbalanced_data-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.handle_imbalanced_data</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function balances an imbalanced dataset according to a specified
          sampling strategy (e.g. SMOTE, undersampling, oversampling) to prepare
          for a classification model.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def handle_imbalanced_data(df: pd.DataFrame, target_variable: str, strategy=\"smote\", k_neighbors=2, untouched_columns: List[str]=[]) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>df (pd.DataFrame)</code> – The dataframe with the target
            column.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>target_variable (str)</code> – The target column name.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>strategy (str)</code> – The sampling strategy, e.g.
            <code className={`${inriaSerif.className}`}>
              "smote"
            </code>
            , <code className={`${inriaSerif.className}`}>"undersampling"</code>, or
            <code className={`${inriaSerif.className}`}>"oversampling"</code>.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>k_neighbors (int)</code> – The <code className={`${inriaSerif.className}`}>
              k
            </code>
            neighbors parameter for SMOTE.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>untouched_columns (List[str])</code> – Columns that should not
            be modified by the balancing process.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>pd.DataFrame</code> – The balanced dataframe after applying the
          specified strategy.
        </p>
      </div>
    ),

    "remove_outliers-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.remove_outliers</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function detects outliers outside the range of 2.575 (99% CI) and
          removes those observations if they occur in more than 10% of the
          column.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def remove_outliers(df: pd.DataFrame) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>df (pd.DataFrame)</code> – The dataframe to check for
            outliers.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>pd.DataFrame</code> – The dataframe after outlier removal.
        </p>
      </div>
    ),

    "separate_target_column-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.separate_target_column</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function separates the given target column from the main
          dataframe, returning a tuple of (features, target).
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def separate_target_column(df: pd.DataFrame, target_variable: str) -> Tuple[pd.DataFrame, pd.DataFrame]:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>df (pd.DataFrame)</code> – The dataframe containing the target
            column.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>target_variable (str)</code> – The name of the target column.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>Tuple[pd.DataFrame, pd.DataFrame]</code> – A tuple containing
          the dataframe with all columns except the target, and the separated
          target dataframe.
        </p>
      </div>
    ),

    "encoding-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.encoding</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function encodes object-type columns in the given dataframe. If a
          column has more than 3 unique categories, it performs label encoding.
          Otherwise, it performs one-hot encoding. Columns in
          <code className={`${inriaSerif.className}`}>untouched_columns</code> are not encoded.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def encoding(features: pd.DataFrame, untouched_columns: List[str]=[]) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>features (pd.DataFrame)</code> – Dataframe of features
            (excluding the target column).
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>untouched_columns (List[str])</code> – Columns that should not
            be encoded.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>pd.DataFrame</code> – The dataframe with all applicable columns
          encoded.
        </p>
      </div>
    ),

    "feature_scaling-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.feature_scaling</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function scales continuous numerical columns. If the column is
          normally distributed, StandardScaler is used; otherwise, MinMaxScaler
          is used. Only columns with more than 3 unique values are scaled. Any
          columns listed in <code className={`${inriaSerif.className}`}>unscale_columns</code> remain unscaled.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def feature_scaling(features: pd.DataFrame, unscale_columns: List[str]=[]) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>features (pd.DataFrame)</code> – The dataframe containing
            columns to be scaled.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>unscale_columns (List[str])</code> – Columns that should not
            be scaled.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>pd.DataFrame</code> – The dataframe with scaled columns (where
          appropriate).
        </p>
      </div>
    ),

    "combine-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.combine</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function combines the features dataframe and the target dataframe
          into a single dataframe.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def combine(features: pd.DataFrame, target: pd.DataFrame) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>features (pd.DataFrame)</code> – The dataframe of features.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>target (pd.DataFrame)</code> – The dataframe of the target
            column(s).
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>pd.DataFrame</code> – A combined dataframe containing all
          features and the target.
        </p>
      </div>
    ),

    "preprocess_pipeline-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.preprocess_pipeline</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function is a stand-alone pipeline used for the free website
          template, where you can interact with a GUI. It consolidates many of
          the earlier preprocessing steps, including dropping columns,
          validating the target, checking for duplicates, handling missing
          values, optional sampling, etc.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`
            def preprocess_pipeline(
                file_path: str,
                target_column: str,
                dropped_columns: List[str] = [],
                untouched_columns: List[str] = [],
                type_dataset: int = 0,    # 0 -> Cross Sectional, 1 -> Time Series
                sampling: int = 1,       # 0 -> No sampling, 1 -> Sampling
                classification: int = 1, # 0 -> Regression, 1 -> Classification
                strategy_sample="smote"  # 'oversampling', 'undersampling', 'smote'
            ) -> pd.DataFrame:
          `}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>file_path (str)</code> – The path to the dataset.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>target_column (str)</code> – The name of the target variable.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>dropped_columns (List[str])</code> – Columns to be dropped.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>untouched_columns (List[str])</code> – Columns not to be
            scaled or encoded.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>type_dataset (int)</code> – 0 for cross-sectional, 1 for time
            series.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>sampling (int)</code> – 0 for no sampling, 1 for sampling.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>classification (int)</code> – 0 for regression, 1 for
            classification.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>strategy_sample (str)</code> – The sampling strategy e.g.
            <code className={`${inriaSerif.className}`}>"smote"</code>, <code className={`${inriaSerif.className}`}>"oversampling"</code>, or
            <code className={`${inriaSerif.className}`}>"undersampling"</code>.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>pd.DataFrame</code> – The preprocessed dataframe.
        </p>
      </div>
    ),

    // --------------------------------
    // weedout.datainfo / .visualization
    // --------------------------------

    "filtered_correlation_matrix-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.filtered_correlation_matrix</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function prints the Variance Inflation Factor (VIF) of each
          feature column to indicate potential multi-collinearity. VIF =
          <code className={`${inriaSerif.className}`}>1 / (1 - R^2)</code>. The user is expected to remove correlated
          features if the VIF is too high.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def filtered_correlation_matrix(df: pd.DataFrame) -> None:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>df (pd.DataFrame)</code> – The dataframe provided by the user.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>None</code> – This function only prints the VIF for each
          feature.
        </p>
      </div>
    ),

    "display-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.display</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function prints the info of the original dataset (from the given
          file path) and compares it with the preprocessed dataframe’s info.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def display(file_path: str, df: pd.DataFrame) -> None:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>file_path (str)</code> – The path to the original file.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>df (pd.DataFrame)</code> – The preprocessed dataframe.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>None</code> – This function displays dataset info directly.
        </p>
      </div>
    ),

    "show_removed_outliers-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.show_removed_outliers</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          A visualization function to compare the boxplot spread of the original
          dataset versus the preprocessed dataset after outliers have been
          removed.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def show_removed_outliers(df_original: pd.DataFrame, df_pre_processed: pd.DataFrame) -> None:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>df_original (pd.DataFrame)</code> – The original dataset.
          </li>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>df_pre_processed (pd.DataFrame)</code> – The dataset after
            outlier removal.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>None</code> – Displays boxplots comparing the original vs.
          preprocessed datasets.
        </p>
      </div>
    ),

    "plot_filtered_correlation_matrix-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4 ${inriaSerif.className}`}>.plot_filtered_correlation_matrix</h2>
        <p className={`mt-4 ${inriaSerif.className}`}>
          This function plots the correlation matrix of features based on the
          Variance Inflation Factor (VIF). The user is expected to remove some
          highly correlated features after examining the plot.
        </p>
        <CodeBlock
          className={`${inriaSerif.className}`}
          code={`def plot_filtered_correlation_matrix(df: pd.DataFrame) -> None:`}
          language="python"
        />
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Parameters:</h3>
        <ul className={`list-disc pl-6 ${inriaSerif.className}`}>
          <li className={`${inriaSerif.className}`}>
            <code className={`${inriaSerif.className}`}>df (pd.DataFrame)</code> – The dataframe provided by user.
          </li>
        </ul>
        <h3 className={`text-xl font-bold mt-6 mb-2 ${inriaSerif.className}`}>Returns:</h3>
        <p className={`${inriaSerif.className}`}>
          <code className={`${inriaSerif.className}`}>None</code> – Displays the correlation matrix plot.
        </p>
      </div>
    ),

    // Add more sections/pages here as needed
  };

export default function ContentArea({ contentKey }) {
    const { setActiveNavItem } = useUI();
    const router = useRouter();
    const contentRef = useRef(null);

    // Use useLayoutEffect to ensure that the DOM is highlighted after it is updated
    useLayoutEffect(() => {
      if (contentRef.current) {
        // Manually trigger all code blocks to highlight
        contentRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
        });
      }
    }, [contentKey]); // contentKey

    // const handleBack = () => {
    //     setActiveNavItem('');
    //     router.back();
    // };

    // Dynamically generate content and add unique keys
    const renderContent = () => {
      const content = contentMap[contentKey];
      if (!content) return <p className= {`${inriaSerif.className}`}>Select a topic from the sidebar</p>;
      
      return React.cloneElement(content, {
        children: React.Children.map(content.props.children, (child, index) => {
          if (child.type === CodeBlock) {
            return React.cloneElement(child, {
              key: `${contentKey}-codeblock-${index}`,
              className: `${inriaSerif.className}`
            });
          }
          return child;
        }),
      });
    };

    return (
      <div className={`max-w-none text-beige px-4 md:px-0 ${inriaSerif.className}`} ref={contentRef}>
          {/* <button 
              onClick={handleBack}
              className="absolute top-0 right-0 text-sm text-blue-200 hover:text-blue-400"
          >
              ← Back to Documentation
          </button> */}
          <div className={`max-w-full md:max-w-4xl mx-auto ${inriaSerif.className}`}>
              {renderContent()}
          </div>
      </div>
    );
}