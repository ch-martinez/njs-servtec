import pdfMaster from 'pdf-master'

export const detailToPdf = async (data) => {

    const path = './src/utils/pdf/detail.template.hbs'

    const options = {
        displayHeaderFooter: true,
        format: "A4",
        margin: { top: "30px", bottom: "30px", right: "15px", left: "15px" },
      };

    const pdf = await pdfMaster.generatePdf(path, data, options)



    return pdf
}