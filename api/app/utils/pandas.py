import pandas as pd
from pandas.core.frame import DataFrame
from io import StringIO


class PandasUtils:
    
    @staticmethod
    def csv_to_df(file: StringIO) -> DataFrame:
        binary_file = StringIO(file.decode("utf-8"))
        df = pd.read_csv(binary_file, sep=",")
        if len(df.columns.values) == 1:
            binary_file = StringIO(file.decode("utf-8"))
            df = pd.read_csv(binary_file, sep=";")
        return df
