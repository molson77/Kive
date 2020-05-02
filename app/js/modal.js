
// Opens a modal (takes modal type, list of prompts, and a function to be called on confirmation -> ie clicking "ok")
function openModal(type, title, prompts, func) {
    // Get all html parts of the modal
    let modalBase = document.getElementById("modal");
    let modalHeader = modalBase.getElementsByClassName("modal-header")[0];
    let modalBody = modalBase.getElementsByClassName("modal-body")[0];
    let modalFooter = modalBase.getElementsByClassName("modal-footer")[0];
    let modalTitle = modalBase.getElementsByClassName("modal-title")[0];

    // Clears modal content
    modalBody.innerHTML = "";
    modalFooter.innerHTML = "";

    // Sets modal header to title passed in
    modalTitle.innerHTML = title;

    // Adds elements to modal based on passed-in type
    // Single input modal
    if (type == "single-input") {
        // Label for input
        let label = document.createElement("LABEL");
        label.appendChild(document.createTextNode(prompts[0]));
        modalBody.appendChild(label);
        // Input
        let input = null;
        input = document.createElement("INPUT");
        input.type = "text";
        modalBody.appendChild(input);
        // Create affirmation and cancel buttons
        let affirmBtn = document.createElement("BUTTON");
        // Calls function passed in on input value
        affirmBtn.onclick = function () { func(input.value); $("#modal").modal("toggle"); };
        affirmBtn.appendChild(document.createTextNode("Ok"));
        affirmBtn.className = "btn btn-success";
        modalFooter.appendChild(affirmBtn);
    }
    // Confirmation modal
    if (type == "confirmation") {
        // Label for confirmation
        let label = document.createElement("LABEL");
        label.appendChild(document.createTextNode(prompts[0]));
        modalBody.appendChild(label);
        // Create affirmation and cancel buttons
        let affirmBtn = document.createElement("BUTTON");
        // Calls function passed in on input value
        affirmBtn.onclick = function () { func(); $("#modal").modal("toggle"); };
        affirmBtn.appendChild(document.createTextNode("Yes"));
        affirmBtn.className = "btn btn-success";
        modalFooter.appendChild(affirmBtn);

    }
    // Get Info for a Node
    if (type == "get-info") {
        let n = prompts[0]
        let contents = document.createElement("DIV");
        contents.style.wordWrap = "break-word";

        // Name
        let nameLabel = document.createElement("B");
        nameLabel.appendChild(document.createTextNode("Name: "));
        contents.appendChild(nameLabel)
        contents.appendChild(document.createTextNode(n.name));
        contents.appendChild(document.createElement("br"));

        // Path
        let pathLabel = document.createElement("B");
        pathLabel.appendChild(document.createTextNode("Path: "));
        contents.appendChild(pathLabel)
        contents.appendChild(document.createTextNode(n.path));
        contents.appendChild(document.createElement("br"));

        // Legacy Ingest Date
        let legacyLabel = document.createElement("B");
        legacyLabel.appendChild(document.createTextNode("Legacy Platform Ingest Date: "));
        contents.appendChild(legacyLabel)
        contents.appendChild(document.createTextNode(n.legacy_ingest));
        contents.appendChild(document.createElement("br"));

        // Kive Ingest Date
        let kiveLabel = document.createElement("B");
        kiveLabel.appendChild(document.createTextNode("Kive Ingest Date: "));
        contents.appendChild(kiveLabel)
        contents.appendChild(document.createTextNode(n.ingest));
        contents.appendChild(document.createElement("br"));

        // Last Accessed Date
        let accessedLabel = document.createElement("B");
        accessedLabel.appendChild(document.createTextNode("Last Accesssed Date: "));
        contents.appendChild(accessedLabel)
        contents.appendChild(document.createTextNode(n.last_accessed));

        modalBody.appendChild(contents)
    }

    // Invalid Search Date-Range Modal
    if (type == "search-query-error") {
        let contents = document.createElement("DIV");
        contents.style.wordWrap = "break-word";

        // Error Message
        let errorMessage = document.createElement("B");
        errorMessage.appendChild(document.createTextNode("ERROR: Invalid Date Range"));
        contents.appendChild(errorMessage)

        modalBody.appendChild(contents)
    }

    // Find lost file/folder modal
    if (type == "find-lost-file") {
        // Label for input
        /*let label = document.createElement("LABEL");
        label.appendChild(document.createTextNode(prompts[0]));
        modalBody.appendChild(label);*/
        // Input
        let chooseFile = document.createElement("BUTTON");
        chooseFile.onclick = function () { chooseFilePath(func); }
        chooseFile.appendChild(document.createTextNode(prompts[0]));
        modalBody.appendChild(chooseFile);
    }

    if (type == "import-options-info") {
        let contents = document.createElement("DIV");
        contents.style.wordWrap = "break-word";
        
        // Import file options
        let fileLabel = document.createElement("B");
        fileLabel.appendChild(document.createTextNode("Import File: "));
        contents.appendChild(fileLabel)
        contents.appendChild(document.createTextNode("Kive supports .html and .htm files"));
        contents.appendChild(document.createElement("br"));

        // Import folder options
        let folderLabel = document.createElement("B");
        folderLabel.appendChild(document.createTextNode("Import Folder: "));
        contents.appendChild(folderLabel)
        contents.appendChild(document.createTextNode("Kive will find all relative webpage files within this directory while retaining structure"));
        contents.appendChild(document.createElement("br"));

        // Import WebScrapBook options
        let wsbLabel = document.createElement("B");
        wsbLabel.appendChild(document.createTextNode("Import WebScrapBook: "));
        contents.appendChild(wsbLabel)
        contents.appendChild(document.createTextNode("Select a WebScrapBook repository folder that contains a data/ folder. If the tree/ folder is also available, Kive will retain structure"));
        contents.appendChild(document.createElement("br"));

        // Import ScrapBook options
        let sbLabel = document.createElement("B");
        sbLabel.appendChild(document.createTextNode("Import ScrapBook: "));
        contents.appendChild(sbLabel)
        contents.appendChild(document.createTextNode("Select a ScrapBook repository folder that contains a data/ folder. If the .rdf file is also available, Kive will retain structure"));
        contents.appendChild(document.createElement("br"));

        modalBody.appendChild(contents)
    }


    let cancelBtn = document.createElement("BUTTON");
    cancelBtn.appendChild(document.createTextNode("cancel"));
    cancelBtn.onclick = function () { $("#modal").modal("toggle"); };
    cancelBtn.className = "btn btn-danger";

    // Add buttons to footer
    modalFooter.appendChild(cancelBtn);

    // Opens modal
    $("#modal").modal("toggle");
}

// Retrieve selected file
function chooseFilePath(func) {
    console.log('chooseFilePath called');
    let remote = require('electron').remote;
    let dialog = remote.dialog;

    dialog.showOpenDialog({
        title: "Select a file",
        properties: ['openFile'],
        filters: [{
            name: 'Entries',
            extensions: ['htm', 'html']
        }]
    }).then(folderPaths => {
        // folderPaths is an array that contains all the selected paths
        if (folderPaths.filePaths === undefined || folderPaths.filePaths == "") {
            console.log("No destination folder selected");
            return;
        }
        else {
            $("#modal").modal("toggle");
            func(folderPaths.filePaths[0]);
        }
    });
}