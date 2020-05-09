from datetime import datetime
from selectolax.parser import HTMLParser

import os
import uuid

'''
Non-legacy directory ingest workflow.
'''

def find_files(folder, get_source):
    '''
    Walks through the specified directory to find all web pages and create JSON objects for them.
    '''

    def find_files_helper(folder, json_obj):
        folder_list = os.listdir(folder)
        folders = []

        html_files = set()

        for entity in folder_list:
            if os.path.isdir(folder + "/" + entity):
                folders.append(folder + "/" + entity)
            else:
                # Get file extension
                ext = os.path.splitext(entity)

                # Only handle html or htm files
                if ext[1] in ('.html', '.htm'):
                    html_files.add(folder + "/" + entity.split(".htm")[0] + "_files")

                    # Set base source_url
                    source_url = ''

                    # Check if source url is wanted on ingest, if so get url
                    if get_source:
                        source_url = get_canonical(folder + '/' + entity)

                    # Create new JSON object that represents a web page and its metadata
                    new_file_obj = {
                        'type': 'file',
                        'name': os.path.basename(folder + "/" + entity),
                        'legacy_ingest': '',
                        'ingest': datetime.now().strftime('%Y%m%d'),
                        'last_accessed': datetime.fromtimestamp(os.path.getmtime(folder + '/' + entity)).strftime('%Y%m%d'),
                        'path': folder + "/" + entity,
                        'source': source_url,
                        'icon': '',
                        'id': str(uuid.uuid4()),
                        'children': []
                    }
                    json_obj['children'].append(new_file_obj)
                    json_lst.append(new_file_obj)

        for f in folders:
            go_in = True
            if f in html_files:
                go_in = False
            if go_in:
                new_folder_obj = {
                    'type': 'folder',
                    'name': os.path.basename(f),
                    'id': str(uuid.uuid4()),
                    'children': []
                }
                json_obj['children'].append(new_folder_obj)
                find_files_helper(f, new_folder_obj)

    # Flat list of web page JSON nodes that are passed to the indexing function
    json_lst = []

    # Provides the root folder for the JSON tree
    json_tree = {
        'type': 'folder',
        'name': os.path.basename(folder),
        'id': str(uuid.uuid4()),
        'children': []
    }

    try:
        find_files_helper(folder, json_tree)
    except Exception as e:
        return None, None

    return [json_tree], json_lst

def get_canonical(path):
    '''
    Finds link tag with rel attribute == 'canonical' to use for icon path.
    '''

    with open(path, 'r', encoding='utf8', errors='ignore') as f:
        html = f.read()    
        tree = HTMLParser(html)
        url = ''
        
        for node in tree.css('link'):
            if 'rel' in node.attributes and node.attributes['rel'] == 'canonical':
                url = node.attributes['href']
        
        return url