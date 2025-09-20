import pandas as pd
import io

def check_workbook_sum(xlsx_bytes: bytes, sheet_name: str = None, column_name: str = "Amount", expected_sum: float = 1000.0):	
	bio = io.BytesIO(xlsx_bytes)
	try:
		if sheet_name:
			df = pd.read_excel(bio, sheet_name=sheet_name)
		else:
			df = pd.read_excel(bio)  
	except Exception as e:
		raise
	if column_name not in df.columns:	
		cols = {c.lower(): c for c in df.columns}
		if column_name.lower() in cols:
			col = cols[column_name.lower()]
		else:
			return False, None
	else:
		col = column_name
	s = pd.to_numeric(df[col], errors='coerce').sum(skipna=True)
	
	ok = abs(s - expected_sum) < 1e-6
	return ok, float(s)