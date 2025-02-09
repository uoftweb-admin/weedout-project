// app/documentation/user-guide/ContentArea.jsx
import React from "react";
import CodeBlock from "./CodeBlock";
import { useRef } from "react";
import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "../UIProvider";
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';

hljs.registerLanguage('python', python);

  // ----------------------
  // 1) Define all content:
  // ----------------------
  const contentMap = {
    // Example top-level guide entry:
    "10-minutes-to-weedout-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">10 minutes to weedout</h2>
        <p className="mt-4">
          Weedout is a Python library that helps you preprocess your data and
          visualize it. It is an open-source library that is easy to use and has
          a wide range of features. It is built on top of pandas and matplotlib.
        </p>
        <p className="mt-4">
          In this guide, we will show you how to quickly get started with
          Weedout to preprocess your data and visualize it. We will cover:
        </p>
        <ul className="list-disc pl-6 mt-4">
          <li>Preprocessing data using Weedout</li>
          <li>Visualizing data using Weedout</li>
        </ul>
      </div>
    ),

    // --------------------------------
    // weedout.preprocess  (functions)
    // --------------------------------

    "check_target_variable-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.check_target_variable</h2>
        <p className="mt-4">
          The function returns <code>True</code> if the given target name exists
          in the dataframe. It returns <code>False</code> if the target name is
          not in the dataframe.
        </p>
        <CodeBlock
          code={`def check_target_variable(df: pd.DataFrame, target_name: str) -> bool:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>df (pd.DataFrame)</code> – The dataframe to check.
          </li>
          <li>
            <code>target_name (str)</code> – The name of the target variable.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>bool</code> – <code>True</code> if the target variable exists,
          otherwise <code>False</code>.
        </p>
      </div>
    ),

    "check_duplicate_columns-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.check_duplicate_columns</h2>
        <p className="mt-4">
          This function checks if the dataset (CSV file) has multiple columns
          with the same name. It returns a list of duplicate column names.
        </p>
        <CodeBlock
          code={`def check_duplicate_columns(file_path: str) -> List[str]:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>file_path (str)</code> – The path to the CSV file.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>List[str]</code> – A list of all duplicate column names in the
          dataset.
        </p>
      </div>
    ),

    "initial_check_dt-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.initial_check_dt</h2>
        <p className="mt-4">
          The function initially checks if the file provided is a valid CSV file
          that can be parsed. It checks and drops duplicate columns, verifies
          the target variable, and drops columns with exceedingly high null
          values while leaving untouched columns intact.
        </p>
        <CodeBlock
          code={`def initial_check_dt(file_path: str, target_variable: str, columns_to_drop: List[str]) -> Optional[pd.DataFrame]:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>file_path (str)</code> – The path to the CSV file.
          </li>
          <li>
            <code>target_variable (str)</code> – The target column in the
            dataset.
          </li>
          <li>
            <code>columns_to_drop (List[str])</code> – The list of columns that
            the user explicitly wants dropped from the dataset.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>Optional[pd.DataFrame]</code> – The modified dataframe if the
          function is successful; otherwise, <code>None</code>.
        </p>
      </div>
    ),

    "cross_sectional_imputation-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.cross_sectional_imputation</h2>
        <p className="mt-4">
          This function performs imputation on a cross-sectional dataset.
          Numeric columns are imputed with their mean (average) value, while
          string/categorical columns are imputed with their mode (most frequent)
          value.
        </p>
        <CodeBlock
          code={`def cross_sectional_imputation(cross_sectional_df: pd.DataFrame, target_name: str) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>cross_sectional_df (pd.DataFrame)</code> – The dataframe
            (cross-sectional) with the target column included.
          </li>
          <li>
            <code>target_name (str)</code> – The name of the target column.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>pd.DataFrame</code> – The modified dataframe after imputation.
        </p>
      </div>
    ),

    "time_series_imputation-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.time_series_imputation</h2>
        <p className="mt-4">
          This function performs imputation on a time-series dataset. Numeric
          columns are imputed via linear interpolation, while string/categorical
          columns are imputed with their mode (most frequent) value.
        </p>
        <CodeBlock
          code={`def time_series_imputation(time_series_df: pd.DataFrame, target_name: str) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>time_series_df (pd.DataFrame)</code> – The time series
            dataframe including the target column.
          </li>
          <li>
            <code>target_name (str)</code> – The name of the target column.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>pd.DataFrame</code> – The modified dataframe after imputation.
        </p>
      </div>
    ),

    "handle_imbalanced_data-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.handle_imbalanced_data</h2>
        <p className="mt-4">
          This function balances an imbalanced dataset according to a specified
          sampling strategy (e.g. SMOTE, undersampling, oversampling) to prepare
          for a classification model.
        </p>
        <CodeBlock
          code={`def handle_imbalanced_data(df: pd.DataFrame, target_variable: str, strategy="smote", k_neighbors=2, untouched_columns: List[str]=[]) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>df (pd.DataFrame)</code> – The dataframe with the target
            column.
          </li>
          <li>
            <code>target_variable (str)</code> – The target column name.
          </li>
          <li>
            <code>strategy (str)</code> – The sampling strategy, e.g.{" "}
            <code>"smote"</code>, <code>"undersampling"</code>, or{" "}
            <code>"oversampling"</code>.
          </li>
          <li>
            <code>k_neighbors (int)</code> – The <code>k</code> neighbors
            parameter for SMOTE.
          </li>
          <li>
            <code>untouched_columns (List[str])</code> – Columns that should not
            be modified by the balancing process.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>pd.DataFrame</code> – The balanced dataframe after applying the
          specified strategy.
        </p>
      </div>
    ),

    "remove_outliers-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.remove_outliers</h2>
        <p className="mt-4">
          This function detects outliers outside the range of 2.575 (99% CI) and
          removes those observations if they occur in more than 10% of the
          column.
        </p>
        <CodeBlock
          code={`def remove_outliers(df: pd.DataFrame) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>df (pd.DataFrame)</code> – The dataframe to check for
            outliers.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>pd.DataFrame</code> – The dataframe after outlier removal.
        </p>
      </div>
    ),

    "separate_target_column-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.separate_target_column</h2>
        <p className="mt-4">
          This function separates the given target column from the main
          dataframe, returning a tuple of (features, target).
        </p>
        <CodeBlock
          code={`def separate_target_column(df: pd.DataFrame, target_variable: str) -> Tuple[pd.DataFrame, pd.DataFrame]:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>df (pd.DataFrame)</code> – The dataframe containing the target
            column.
          </li>
          <li>
            <code>target_variable (str)</code> – The name of the target column.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>Tuple[pd.DataFrame, pd.DataFrame]</code> – A tuple containing
          the dataframe with all columns except the target, and the separated
          target dataframe.
        </p>
      </div>
    ),

    "encoding-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.encoding</h2>
        <p className="mt-4">
          This function encodes object-type columns in the given dataframe. If a
          column has more than 3 unique categories, it performs label encoding.
          Otherwise, it performs one-hot encoding. Columns in{" "}
          <code>untouched_columns</code> are not encoded.
        </p>
        <CodeBlock
          code={`def encoding(features: pd.DataFrame, untouched_columns: List[str]=[]) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>features (pd.DataFrame)</code> – Dataframe of features
            (excluding the target column).
          </li>
          <li>
            <code>untouched_columns (List[str])</code> – Columns that should not
            be encoded.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>pd.DataFrame</code> – The dataframe with all applicable columns
          encoded.
        </p>
      </div>
    ),

    "feature_scaling-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.feature_scaling</h2>
        <p className="mt-4">
          This function scales continuous numerical columns. If the column is
          normally distributed, StandardScaler is used; otherwise, MinMaxScaler
          is used. Only columns with more than 3 unique values are scaled. Any
          columns listed in <code>unscale_columns</code> remain unscaled.
        </p>
        <CodeBlock
          code={`def feature_scaling(features: pd.DataFrame, unscale_columns: List[str]=[]) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>features (pd.DataFrame)</code> – The dataframe containing
            columns to be scaled.
          </li>
          <li>
            <code>unscale_columns (List[str])</code> – Columns that should not
            be scaled.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>pd.DataFrame</code> – The dataframe with scaled columns (where
          appropriate).
        </p>
      </div>
    ),

    "combine-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.combine</h2>
        <p className="mt-4">
          This function combines the features dataframe and the target dataframe
          into a single dataframe.
        </p>
        <CodeBlock
          code={`def combine(features: pd.DataFrame, target: pd.DataFrame) -> pd.DataFrame:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>features (pd.DataFrame)</code> – The dataframe of features.
          </li>
          <li>
            <code>target (pd.DataFrame)</code> – The dataframe of the target
            column(s).
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>pd.DataFrame</code> – A combined dataframe containing all
          features and the target.
        </p>
      </div>
    ),

    "preprocess_pipeline-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.preprocess_pipeline</h2>
        <p className="mt-4">
          This function is a stand-alone pipeline used for the free website
          template, where you can interact with a GUI. It consolidates many of
          the earlier preprocessing steps, including dropping columns,
          validating the target, checking for duplicates, handling missing
          values, optional sampling, etc.
        </p>
        <CodeBlock
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
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>file_path (str)</code> – The path to the dataset.
          </li>
          <li>
            <code>target_column (str)</code> – The name of the target variable.
          </li>
          <li>
            <code>dropped_columns (List[str])</code> – Columns to be dropped.
          </li>
          <li>
            <code>untouched_columns (List[str])</code> – Columns not to be
            scaled or encoded.
          </li>
          <li>
            <code>type_dataset (int)</code> – 0 for cross-sectional, 1 for time
            series.
          </li>
          <li>
            <code>sampling (int)</code> – 0 for no sampling, 1 for sampling.
          </li>
          <li>
            <code>classification (int)</code> – 0 for regression, 1 for
            classification.
          </li>
          <li>
            <code>strategy_sample (str)</code> – The sampling strategy e.g.
            &quot;smote&quot;, &quot;oversampling&quot;, or
            &quot;undersampling&quot;.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>pd.DataFrame</code> – The preprocessed dataframe.
        </p>
      </div>
    ),

    // --------------------------------
    // weedout.datainfo / .visualization
    // --------------------------------

    "filtered_correlation_matrix-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.filtered_correlation_matrix</h2>
        <p className="mt-4">
          This function prints the Variance Inflation Factor (VIF) of each
          feature column to indicate potential multi-collinearity. VIF ={" "}
          <code>1 / (1 - R^2)</code>. The user is expected to remove correlated
          features if the VIF is too high.
        </p>
        <CodeBlock
          code={`def filtered_correlation_matrix(df: pd.DataFrame) -> None:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>df (pd.DataFrame)</code> – The dataframe provided by the user.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>None</code> – This function only prints the VIF for each
          feature.
        </p>
      </div>
    ),

    "display-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.display</h2>
        <p className="mt-4">
          This function prints the info of the original dataset (from the given
          file path) and compares it with the preprocessed dataframe’s info.
        </p>
        <CodeBlock
          code={`def display(file_path: str, df: pd.DataFrame) -> None:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>file_path (str)</code> – The path to the original file.
          </li>
          <li>
            <code>df (pd.DataFrame)</code> – The preprocessed dataframe.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>None</code> – This function displays dataset info directly.
        </p>
      </div>
    ),

    "show_removed_outliers-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.show_removed_outliers</h2>
        <p className="mt-4">
          A visualization function to compare the boxplot spread of the original
          dataset versus the preprocessed dataset after outliers have been
          removed.
        </p>
        <CodeBlock
          code={`def show_removed_outliers(df_original: pd.DataFrame, df_pre_processed: pd.DataFrame) -> None:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>df_original (pd.DataFrame)</code> – The original dataset.
          </li>
          <li>
            <code>df_pre_processed (pd.DataFrame)</code> – The dataset after
            outlier removal.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>None</code> – Displays boxplots comparing the original vs.
          preprocessed datasets.
        </p>
      </div>
    ),

    "plot_filtered_correlation_matrix-content": (
      <div>
        <h2 className="text-2xl font-bold mb-4">.plot_filtered_correlation_matrix</h2>
        <p className="mt-4">
          This function plots the correlation matrix of features based on the
          Variance Inflation Factor (VIF). The user is expected to remove some
          highly correlated features after examining the plot.
        </p>
        <CodeBlock
          code={`def plot_filtered_correlation_matrix(df: pd.DataFrame) -> None:`}
          language="python"
        />
        <h3 className="text-xl font-bold mt-6 mb-2">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li>
            <code>df (pd.DataFrame)</code> – The dataframe provided by user.
          </li>
        </ul>
        <h3 className="text-xl font-bold mt-6 mb-2">Returns:</h3>
        <p>
          <code>None</code> – Displays the correlation matrix plot.
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

    const handleBack = () => {
        setActiveNavItem('');
        router.back();
    };

    // Dynamically generate content and add unique keys
    const renderContent = () => {
      const content = contentMap[contentKey];
      if (!content) return <p>Select a topic from the sidebar</p>;
      
      return React.cloneElement(content, {
        children: React.Children.map(content.props.children, (child, index) => {
          if (child.type === CodeBlock) {
            return React.cloneElement(child, {
              key: `${contentKey}-codeblock-${index}`,
            });
          }
          return child;
        }),
      });
    };

    return (
      <div className="prose max-w-none text-beige px-4 md:px-0" ref={contentRef}>
          {/* <button 
              onClick={handleBack}
              className="absolute top-0 right-0 text-sm text-blue-200 hover:text-blue-400"
          >
              ← Back to Documentation
          </button> */}
          <div className="max-w-full md:max-w-4xl mx-auto">
              {renderContent()}
          </div>
      </div>
    );
}