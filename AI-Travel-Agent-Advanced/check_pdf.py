try:
    import PyPDF2
    print("PyPDF2 imported")
except ImportError:
    print("PyPDF2 failed")

try:
    import pypdf
    print("pypdf imported")
except ImportError:
    print("pypdf failed")
