const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const convertBtn = document.getElementById("convertBtn");

fileInput.addEventListener("change", () => {

    fileName.innerHTML = "";

    if(fileInput.files.length === 0){
        fileName.textContent = "No files selected";
        return;
    }

    Array.from(fileInput.files).forEach(file => {
        const div = document.createElement("div");
        div.textContent = file.name;
        fileName.appendChild(div);
    });
});

convertBtn.addEventListener("click", async () => {

    if(fileInput.files.length === 0){
        alert("Please select at least one image.");
        return;
    }

    convertBtn.textContent = "Converting...";

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const files = Array.from(fileInput.files);

    for(let i = 0; i < files.length; i++){

        const dataURL = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.readAsDataURL(files[i]);
        });

        const img = await new Promise(resolve => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.src = dataURL;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const ratio = Math.min(
            pageWidth / img.width,
            pageHeight / img.height
        );

        const imgWidth = img.width * ratio;
        const imgHeight = img.height * ratio;

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        if(i > 0){
            pdf.addPage();
        }

        pdf.addImage(
            dataURL,
            "JPEG",
            x,
            y,
            imgWidth,
            imgHeight
        );
    }

    pdf.save("PDFForge_Document.pdf");

    convertBtn.textContent = "Convert to PDF";
});