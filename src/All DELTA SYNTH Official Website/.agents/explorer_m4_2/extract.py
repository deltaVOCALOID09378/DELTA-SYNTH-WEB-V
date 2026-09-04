import sys
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.ignore = False
        self.ignore_tags = {'script', 'style', 'head', 'meta', 'link'}

    def handle_starttag(self, tag, attrs):
        if tag in self.ignore_tags:
            self.ignore = True

    def handle_endtag(self, tag):
        if tag in self.ignore_tags:
            self.ignore = False

    def handle_data(self, data):
        if not self.ignore:
            stripped = data.strip()
            if stripped:
                self.text.append(stripped)

def extract_text(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    extractor = TextExtractor()
    extractor.feed(content)
    
    with open(output_file, 'w', encoding='utf-8') as out:
        for line in extractor.text:
            if len(line) > 2:
                out.write(line + '\n')

if __name__ == "__main__":
    if len(sys.argv) > 2:
        extract_text(sys.argv[1], sys.argv[2])
