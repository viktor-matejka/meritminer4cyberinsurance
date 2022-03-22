# Profile

[http://localhost:3001/user/profile](http://localhost:3001/user/profile)

View, update, and create Profile

Select a profile from the list to view. And to edit or create, fill in the fields and click "Save" or "Update"

# Eventlog

[http://localhost:3001/user/eventlogs](http://localhost:3001/user/eventlogs)

Select profile for can start work.
On this page you can: create processes name, download, view and delete eventlog files and set file parameters.

## Process name

Process name need for mark Eventlog file.
By clicking on the button you can create a new process to fill in Process name and Description.

## Upload eventlog file

To upload a file, select the file itself and select a process from the list and push "Upload".

## List uploaded files

The list of downloaded files is displayed in a table with columns: file name, process name, mark downloaded file or generated, creation date, and view and delete actions

## View file

View the file in a table with 10 fields. You can also select case, activity, and timestamp values for the file and save it.

# [Underwriting](http://localhost:3001/user/underwriting)

[http://localhost:3001/user/underwriting](http://localhost:3001/user/underwriting)

Create, view, update and delete "Risk assesment from process mining analysis", "Cyber Insurance Policy", "Enterprise-level confidence factors", Coverage and Confidence Factor

## Risk assessment from process mining analysis

To create/update, you need to fill in the following fields: Prospective insured, Cyber Risk Assessment Name and Considered event log. After saving Risk Assessment you can create a Cyber Insurance Policy

## Cyber Insurance Policy

To create/update, you need to fill in the following fields: Name, Description, Insurer Name, Insurer ID. Also you can delete policy. After saving Policy you can create a Enterprise-level confidence factor and a Coverage

## Enterprise-level confidence factor

To create/update, you need to fill in the following fields: Name, Rating. Also you can delete,

## Coverage

To create/update, you need to fill in the following fields: Name, Description, Insurer Name, Insurer ID. Also you can delete Coverage. After saving Coverage you can create a Confidence Factor

## Confidence Factor

To create/update, you need to fill in the following fields: Name, Rating, Description. Also you can delete,

# Discovery

[http://127.0.0.1:3001/user/discovery/](http://127.0.0.1:3001/user/discovery/)

View model graphs and log statistics. Also, upload and save the model (BPMN). Model configuration using parameters (CASE, ACTIVITY, TIMESTAMP) and algorithm.

## View eventlog model

To view statistics, select Log. And for the more accurate results need to select (CASE, ACTIVITY, TIMESTAMP) parameters.

## View graph model

To view the graph, select the log or model. By selecting the log, you can customize the graph using parameters and algorithms.

## Upload BPMN file

After clicking the "Add Model" button, a modal window will open. In the modal window, the name fields and the file field are required. You can also fill in Process, Log, and Algorithm. Click "Save" to save.

## Save model

To save the model, you must first select an Eventlog file. Then write the name, select the parameters and algorithm. And push "Save"

# Conformance

(http://127.0.0.1:3001/user/conformance/)[http://127.0.0.1:3001/user/conformance/]

View Directly-Follows Graphs log, Token-based replay data, and Alignment data, filter with LTL Checker, and save a filtered log file

## View Directly-Follows Graphs table

Select Eventlog file

## View Alignment table

Select Eventlog file

## Filter by LTL Checker

Select Eventlog file. Select Ltl Rule and then A, B, C, D activities.
You can seve LTL rule when enter name and push "Save".
Button "Save Log and Discovery" saves the filtered eventlog and redirect to Discovery.

# Dashbord

In Summary the general statistics on a profile Having selected process the information on the eventlog is loaded.
