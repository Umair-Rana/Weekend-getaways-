function getEmployeeForm(url, eid) {
    var xmlhttp = new XMLHttpRequest();
    var output = document.getElementById("FormDiv");
    var fields, field, value, i, fname, lname;
    output.innerHTML = "Loading...";
    xmlhttp.open("POST", url, true);
    xmlhttp.onreadystatechange = function() {
        display(output, xmlhttp);
        fields = output.getElementsByTagName("input");
        for (i = 0; i < fields.length; ++i) {
            observeEvent(fields[i], "change", function(e) {
                target = getTarget(e);
                field = target.name;
                value = target.value;
                fname = target.form.FirstName.value;
                lname = target.form.LastName.value;
                updateEmployee("EditEmployee", field, value, eid, fname, lname);
            });
        }
    }
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("eid=" + eid);
}