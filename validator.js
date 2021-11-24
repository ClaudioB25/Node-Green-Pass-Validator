const express = require('express');
const { DCC } = require('dcc-utils');
const fetch = require("node-fetch");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8756;

app.use(cors());

// setInterval(loadCrt(), 60000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let arrCertificati = [];

// https://www.cloud.it/tutorial/come-creare-rest-api-con-express-nodejs.aspx
app.post('/greenpass', async (req, res) => {
  var obj = {};
  const barcode = req.body;
  var a = await verifyGreenPassCached(barcode).then(a => {
    res.send(a);
   }).catch((e) => {
    console.log('handle error here: ', e.message);
    res.send(obj);
  })
});

app.listen(port, () => console.log(`In attesa di verificare i green pass sulla porta ${port}!`))

async function verifyGreenPassCached(a) {
  
  //arrCertificati.map((cert) => { dcc.checkSignatureWithCertificate(cert)})
  
  const dcc = await DCC.fromRaw(a.barcode);
  for(let i = 0; i < arrCertificati.length; i++ ){
    try {
      const verified = await dcc.checkSignatureWithCertificate(arrCertificati[i]);
      if (verified) {
        console.log("Valid Green Pass - Obj result: ", dcc.payload);
        return dcc.payload;
      }
    } catch {}
  }
};

async function loadCrt(){
  console.log("Starting... download certificates in memory");
  let headers = {};
  do {
    resp = await fetch('https://get.dgc.gov.it/v1/dgc/signercertificate/update', {
      headers,
    })
    headers = {'X-RESUME-TOKEN' : resp.headers.get('x-resume-token')};
    arrCertificati.push(`-----BEGIN CERTIFICATE-----${await resp.text()}-----END CERTIFICATE-----`);
  } while (resp.status === 200);
}

loadCrt();
