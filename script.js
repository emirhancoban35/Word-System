var rowNumber = 0;
var inputArray = [];
var imageArray = [];

function addRow() {
    rowNumber++;
    $("#input-body").append(" <div class=\"item-name float-clear allinputs\" style=\"clear:both;\"> <div class=\"float-left\"><input type=\"checkbox\" name=\"item_index[]\" /></div> <div class=\"float-left\"><input type=\"text\" class=\"title\" name=\"item_title[]\" /></div><div class=\"float-left\"><input type=\"text\" class=\"text\" name=\"item_title[]\" /></div><div class=\"float-left\"><input type=\"file\" id=\"image-input" + rowNumber + "\" name=\"image[]\" accept=\"image/png, image/gif, image/jpe\" /></div></div>");
}

function deleteRow() {
    $('div.item-name').each(function (index, item) {
        jQuery(':checkbox', this).each(function () {
            if ($(this).is(':checked') && $("input[name='item_title[]']").length > 1) {
                $(item).remove();
                rowNumber--;
            }
        });
    });
}

function imageInputs(imageSrc) {
    if (imageSrc == null) {
        imageArray.push("<br>")
    }
    else {
        imageArray.push("<img src=\"" + imageSrc + "\" width=\"600\" height=\"400\" alt=\"\">");
    }
    console.log(imageArray)
    return imageArray
}

function createInputs() {
    var index = -1
    var images = imageInputs();
    $("#input-body .allinputs").each(function () {
        var obj = $(this);
        var title = obj.find(".title").val();
        var text = obj.find(".text").val();
        index++
        inputArray.push("<br><h1 style=\"color:red\"> " + title + "</h1> <br><h3 style=\"font-family: Arial\"> " + text + "</h3><br> " + images[index]);

    });
    return inputArray;
};

async function createWord(documentName = '') {
    var htmlTop = "<html><head><meta charset='utf-8'>";
    var htmlStyle = "<style></style>";
    var htmlBody = "</head><body>";
    var htmlBottom = "</body></html>";
    var combineHtml = htmlTop + htmlStyle + htmlBody;
    for (let index = 0; rowNumber >= index; index++) {

        let image = $('#image-input' + index)[0];
        var imageSrc = null;

        if (image != null &&  image != undefined) {
            imageSrc = await convertImageToBase64('image-input' + index);
        }
    
        imageInputs(imageSrc);
        if (rowNumber == index) {
            var allInputs = createInputs();
            combineHtml += allInputs + htmlBottom;
            var documentName = documentName ? documentName + ".doc" : "word.doc";
            inputArray = [];
            imageArray = [];
            downloadWord(combineHtml , documentName)
        }
    }
}

function downloadWord(combineHtml , documentName){
    var urlAddress = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(combineHtml);
    var downloadLink = document.createElement("a");
    downloadLink.href = urlAddress;
    downloadLink.download = documentName;
    downloadLink.click();
    document.body.appendChild(downloadLink);
    document.body.removeChild(downloadLink);
}


function convertImageToBase64(inputId) {

    let image = $('#' + inputId)[0]['files']
    if (image && image[0]) {
        const reader = new FileReader();

        return new Promise(resolve => {
            reader.onload = ev => {
                resolve(ev.target.result)
            }
            reader.readAsDataURL(image[0])
        })
    }
}