require('dotenv').config()

const puppeteer = require('puppeteer');
const fs = require('fs');
const nodemailer = require('nodemailer');
const converter = require('json-2-csv');
const Podio = require('podio-js').api;
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const path = require('path');

var namesData = [];
var propertyData = [];
var nomatchPropertyData = [];
var brevardNamesData = [];


var csvNames = null;
var csvProperty = null;
var csvNoMatchProperty = null;

var buf = null;
var buf2 = null;

var LakeCnt = 0;
var BrevardCnt = 0;
var podioJson = null;

let {google} = require('googleapis');
let OAuth2 = google.auth.OAuth2;

let oauth2Client = new OAuth2(
	//ClientID
	process.env.GMAIL_CLIENTID,
	
	//Client Secret
	process.env.GMAIL_SECRET,
	
	//Redirect URL
	"https://developers.google.com/oauthplayground"
);

//Create connection to database
var sqlconfig = 
{
  userName: process.env.AZURE_SQL_USERNAME, // update me
  password: process.env.AZURE_SQL_PASSWORD, // update me
  server: process.env.AZURE_SQL_SERVER, // update me
  options: 
     {
        database: process.env.AZURE_SQL_DATABASE_NAME //update me
        , encrypt: true
     }
}

var connection = new Connection(sqlconfig);


async function getLakeCountyData(){

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) 
{
		if (err) 
		{
		console.log(err)
		}
		else
		{
			//queryDatabase(item)
		}
	}
);

const browser = await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-setuid-sandbox','--ignore-certificate-errors','--disable-gpu','--window-size=1000,800',"--proxy-server='direct://'",'--proxy-bypass-list=*','--enable-features=NetworkService']},{sloMo: 350}, {ignoreHTTPSErrors: true});

const page = await browser.newPage();
//const page2 = await browser.newPage();

await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/67.0.3372.0 Safari/537.36');
await page.goto('https://officialrecords.lakecountyclerk.org/search/SearchTypeDocType',{waitUntil: 'networkidle2'});

// await page2.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/67.0.3372.0 Safari/537.36');
// await page2.goto('https://lakecopropappr.com/property-disclaimer.aspx?to=%2fproperty-search.aspx?',{waitUntil: 'networkidle2'});

console.log("Started Lake Names");
await page.waitFor(3000);
// await page2.waitFor(3000);
try
{
    await page.focus('#btnButton');
	await page.keyboard.type('\n');

	// await page2.focus('#ctl00_cphMain_imgBtnSubmit');
	// await page2.click('#ctl00_cphMain_imgBtnSubmit');

	// await page.bringToFront();
}
catch(error2)
{
     console.log(error2);
} 

await page.waitFor(4000);

try
{

    await page.focus('#DocTypesDisplay-input');
    await page.keyboard.type('LIS PENDENS - LP');
    await page.keyboard.type('\n');

   
}
catch(error)
{
    console.log(error);
}

const d = new Date();
 
  
const dateString = formatDate(d);
const dateFirstDayString = formatDateFirstOfMonth(d);
const dateStringFile = formatDateFile(d);
const dateFirstDayStringFile = formatDateFirstOfMonthFile(d);
const intakeDate = formatIntakeDate(d);
// const sourceData = formatSource(d);

await page.focus('#RecordDateFrom');
await page.keyboard.down('Control');
await page.keyboard.press('KeyA');
await page.keyboard.up('Control');
await page.keyboard.press('Backspace');

// await page.keyboard.type('11/01/2018'),{delay:1000};
await page.keyboard.type(dateFirstDayString),{delay:1000};
  
await page.focus('#RecordDateTo',{delay:2000});
await page.keyboard.down('Control');
await page.keyboard.press('KeyA');
await page.keyboard.up('Control');
await page.keyboard.press('Backspace');
  
// await page.keyboard.type('12/31/2018'),{delay:1000};
await page.keyboard.type(dateString),{delay:1000};

await page.click('#btnSearch');

await page.waitFor(4000);


let pageSelector = '#RsltsGrid > div.t-grid-pager.t-grid-top > div.t-pager.t-reset > div.t-page-i-of-n';

let pageNumber = await page.evaluate((sel) => {
	let element = document.querySelector(sel);
	  return element? element.innerHTML:null;
	  }, pageSelector);

await page.waitFor(500);

pageNumber = pageNumber.replace('Page <input type="text" value="1"> of ','');

// console.log(pageNumber);


//#RsltsGrid > div.t-grid-content > table > tbody > tr:nth-child(2) > td:nth-child(4)
let pageGridOne = '#RsltsGrid > div.t-grid-content > table > tbody > tr:nth-child(INDEX_2) > td:nth-child(4)'
//pageGridOne = pageGridSelector.replace("INDEX",pageGridId);
let pageGridOneRow1 = pageGridOne.replace("INDEX_2","1");
let pageGridOneRow2 = pageGridOne.replace("INDEX_2","2");
let pageGridOneRow3 = pageGridOne.replace("INDEX_2","3");
let pageGridOneRow4 = pageGridOne.replace("INDEX_2","4");
let pageGridOneRow5 = pageGridOne.replace("INDEX_2","5");
let pageGridOneRow6 = pageGridOne.replace("INDEX_2","6");
let pageGridOneRow7 = pageGridOne.replace("INDEX_2","7");
let pageGridOneRow8 = pageGridOne.replace("INDEX_2","8");
let pageGridOneRow9 = pageGridOne.replace("INDEX_2","9");
let pageGridOneRow10 = pageGridOne.replace("INDEX_2","10");
let pageGridOneRow11 = pageGridOne.replace("INDEX_2","11");
let pageGridOneRow12 = pageGridOne.replace("INDEX_2","12");
let pageGridOneRow13 = pageGridOne.replace("INDEX_2","13");
let pageGridOneRow14 = pageGridOne.replace("INDEX_2","14");
let pageGridOneRow15 = pageGridOne.replace("INDEX_2","15");
let pageGridOneRow16 = pageGridOne.replace("INDEX_2","16");
let pageGridOneRow17 = pageGridOne.replace("INDEX_2","17");
let pageGridOneRow18 = pageGridOne.replace("INDEX_2","18");
let pageGridOneRow19 = pageGridOne.replace("INDEX_2","19");
let pageGridOneRow20 = pageGridOne.replace("INDEX_2","20");
let pageGridOneRow21 = pageGridOne.replace("INDEX_2","21");
let pageGridOneRow22 = pageGridOne.replace("INDEX_2","22");
let pageGridOneRow23 = pageGridOne.replace("INDEX_2","23");
let pageGridOneRow24 = pageGridOne.replace("INDEX_2","24");
let pageGridOneRow25 = pageGridOne.replace("INDEX_2","25");
let pageGridOneRow26 = pageGridOne.replace("INDEX_2","26");
let pageGridOneRow27 = pageGridOne.replace("INDEX_2","27");
let pageGridOneRow28 = pageGridOne.replace("INDEX_2","28");
let pageGridOneRow29 = pageGridOne.replace("INDEX_2","29");
let pageGridOneRow30 = pageGridOne.replace("INDEX_2","30");
let pageGridOneRow31 = pageGridOne.replace("INDEX_2","31");
let pageGridOneRow32 = pageGridOne.replace("INDEX_2","32");
let pageGridOneRow33 = pageGridOne.replace("INDEX_2","33");
let pageGridOneRow34 = pageGridOne.replace("INDEX_2","34");
let pageGridOneRow35 = pageGridOne.replace("INDEX_2","35");
let pageGridOneRow36 = pageGridOne.replace("INDEX_2","36");
let pageGridOneRow37 = pageGridOne.replace("INDEX_2","37");
let pageGridOneRow38 = pageGridOne.replace("INDEX_2","38");
let pageGridOneRow39 = pageGridOne.replace("INDEX_2","39");
let pageGridOneRow40 = pageGridOne.replace("INDEX_2","40");
let pageGridOneRow41 = pageGridOne.replace("INDEX_2","41");
let pageGridOneRow42 = pageGridOne.replace("INDEX_2","42");
let pageGridOneRow43 = pageGridOne.replace("INDEX_2","43");
let pageGridOneRow44 = pageGridOne.replace("INDEX_2","44");
let pageGridOneRow45 = pageGridOne.replace("INDEX_2","45");
let pageGridOneRow46 = pageGridOne.replace("INDEX_2","46");
let pageGridOneRow47 = pageGridOne.replace("INDEX_2","47");
let pageGridOneRow48 = pageGridOne.replace("INDEX_2","48");
let pageGridOneRow49 = pageGridOne.replace("INDEX_2","49");
let pageGridOneRow50 = pageGridOne.replace("INDEX_2","50");

pageNumber = pageNumber-1;
 
for (let i = 0; i <= pageNumber ; i++) 
{

  if(i > 0)
  { 
	 await page.focus('#RsltsGrid > div.t-grid-pager.t-grid-top > div.t-pager.t-reset > a:nth-child(6)',{delay:1000});
	 await page.click('#RsltsGrid > div.t-grid-pager.t-grid-top > div.t-pager.t-reset > a:nth-child(6)',{delay:4000});
	 await page.waitFor(2000);
	 //await page2.bringToFront();
  }

let boxResult1  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
}, pageGridOneRow1);
//console.log(boxResult1);

let boxResult2  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
}, pageGridOneRow2);
//console.log(boxResult2);

let boxResult3  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
}, pageGridOneRow3);
//console.log(boxResult3);

let boxResult4  = await page.evaluate((sel) => {
	 let elements = Array.from(document.querySelectorAll(sel));
	   return elements.length;
}, pageGridOneRow4);
//console.log(boxResult4);

let boxResult5  = await page.evaluate((sel) => {
   let elements = Array.from(document.querySelectorAll(sel));
	 return elements.length;
}, pageGridOneRow5);
//console.log(boxResult5);

let boxResult6  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
}, pageGridOneRow6);
//console.log(boxResult6);

let boxResult7  = await page.evaluate((sel) => {
	 let elements = Array.from(document.querySelectorAll(sel));
	   return elements.length;
}, pageGridOneRow7);
//console.log(boxResult7);

let boxResult8  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
}, pageGridOneRow8);
//console.log(boxResult8);

let boxResult9  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
	   return elements.length;
}, pageGridOneRow9);
//console.log(boxResult9);

let boxResult10  = await page.evaluate((sel) => {
	 let elements = Array.from(document.querySelectorAll(sel));
	   return elements.length;
}, pageGridOneRow10);
//console.log(boxResult10);

let boxResult11  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
return elements.length;
}, pageGridOneRow11);
//console.log(boxResult1);

let boxResult12  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
}, pageGridOneRow12);
//console.log(boxResult2);

let boxResult13  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
}, pageGridOneRow13);
//console.log(boxResult3);

let boxResult14  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
}, pageGridOneRow14);
//console.log(boxResult4);

let boxResult15  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
}, pageGridOneRow15);
//console.log(boxResult5);

let boxResult16  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
}, pageGridOneRow16);
//console.log(boxResult6);

let boxResult17  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
}, pageGridOneRow17);
//console.log(boxResult7);

let boxResult18  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
}, pageGridOneRow18);
//console.log(boxResult8);

let boxResult19  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
}, pageGridOneRow19);
//console.log(boxResult9);

let boxResult20  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
}, pageGridOneRow20);
//console.log(boxResult10);

let boxResult21  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
return elements.length;
}, pageGridOneRow21);
//console.log(boxResult1);

let boxResult22  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
}, pageGridOneRow22);
//console.log(boxResult2);

let boxResult23  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
}, pageGridOneRow23);
//console.log(boxResult3);

let boxResult24  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow24);
//console.log(boxResult4);

let boxResult25  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
return elements.length;
}, pageGridOneRow25);
//console.log(boxResult5);

let boxResult26  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
}, pageGridOneRow26);
//console.log(boxResult6);

let boxResult27  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow27);
//console.log(boxResult7);

let boxResult28  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow28);
//console.log(boxResult8);

let boxResult29  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow29);
//console.log(boxResult9);

let boxResult30  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow30);
//console.log(boxResult10);

let boxResult31  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
return elements.length;
}, pageGridOneRow31);
//console.log(boxResult1);

let boxResult32  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
}, pageGridOneRow32);
//console.log(boxResult2);

let boxResult33  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
}, pageGridOneRow33);
//console.log(boxResult3);

let boxResult34  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow34);
//console.log(boxResult4);

let boxResult35  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
return elements.length;
}, pageGridOneRow35);
//console.log(boxResult5);

let boxResult36  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
}, pageGridOneRow36);
//console.log(boxResult6);

let boxResult37  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow37);
//console.log(boxResult7);

let boxResult38  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow38);
//console.log(boxResult8);

let boxResult39  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow39);
//console.log(boxResult9);

let boxResult40  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow40);
//console.log(boxResult10);

let boxResult41  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
return elements.length;
}, pageGridOneRow41);
//console.log(boxResult1);

let boxResult42  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
}, pageGridOneRow42);
//console.log(boxResult2);

let boxResult43  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
}, pageGridOneRow43);
//console.log(boxResult3);

let boxResult44  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow44);
//console.log(boxResult4);

let boxResult45  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
return elements.length;
}, pageGridOneRow45);
//console.log(boxResult5);

let boxResult46  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
}, pageGridOneRow46);
//console.log(boxResult6);

let boxResult47  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow47);
//console.log(boxResult7);

let boxResult48  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow48);
//console.log(boxResult8);

let boxResult49  = await page.evaluate((sel) => {
  let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow49);
//console.log(boxResult9);

let boxResult50  = await page.evaluate((sel) => {
let elements = Array.from(document.querySelectorAll(sel));
  return elements.length;
}, pageGridOneRow50);

	let boxNumbers = (boxResult1+boxResult2+boxResult3+boxResult4+boxResult5+boxResult6+boxResult7+boxResult8+boxResult9+boxResult10+
	boxResult11+boxResult12+boxResult13+boxResult14+boxResult15+boxResult16+boxResult17+boxResult18+boxResult19+boxResult20+
	boxResult21+boxResult22+boxResult23+boxResult24+boxResult25+boxResult26+boxResult27+boxResult28+boxResult29+boxResult30+
	boxResult31+boxResult32+boxResult33+boxResult34+boxResult35+boxResult36+boxResult37+boxResult38+boxResult39+boxResult40+
	boxResult41+boxResult42+boxResult43+boxResult44+boxResult45+boxResult46+boxResult47+boxResult48+boxResult49+boxResult50
  );
  	boxNumbers  = boxNumbers -1;

 	let nameResults = '#RsltsGrid > div.t-grid-content > table > tbody > tr:nth-child(INDEX_2) > td:nth-child(4)'
	let legalResults = '#RsltsGrid > div.t-grid-content > table > tbody > tr:nth-child(INDEX_2) > td:nth-child(10)'
	  

  	for (let i = 0; i <= boxNumbers ; i++) 
	{

		let nameSelector = nameResults.replace("INDEX_2",(i+1));
		let legalSelector = legalResults.replace("INDEX_2",(i+1));

			let name_result = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element? element.innerHTML:null;
				}, nameSelector);

			let legal_result = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element? element.innerHTML:null;
				}, legalSelector);
		//console.log(name_result);
		//console.log(legal_result);

		var OwnerParts = name_result.split(' ');

		var OwnerFirstName = "";
		var OwnerLastName = "";

		OwnerFirstName = OwnerParts[1];
		OwnerLastName = OwnerParts[0];

		var legalPart = legal_result.split(' ');
		var lotNumber = "";
		
		for(let j = 0;j < legalPart.length;j++)
		{
			if(legalPart[j] == 'LT')
			{
				lotNumber = legalPart[(j+1)];
				lotNumber = 'LOT ' + lotNumber;
			}
			else if(legalPart[j] == 'LTS')
			{
				lotNumber = legalPart[(j+1)];
				lotNumber = 'LOTS ' + lotNumber;
			}
		}
		var name = {'firstname':OwnerFirstName,'lastname':OwnerLastName,'lot_number':lotNumber,'county':'lake','full_legal':legal_result};
		namesData.push(name);
		//brevardNamesData.push(name);
		//console.log(name);
		
	

	}
	

}

try
{
			console.log("Finished Lake Names");
			console.log("Starting Lake Property");
			await page.goto('https://lakecopropappr.com/property-disclaimer.aspx?to=%2fproperty-search.aspx?',{waitUntil: 'networkidle2'});
			// await page2.bringToFront();

			await page.waitFor(2000);

			await page.focus('#ctl00_cphMain_imgBtnSubmit');
			await page.click('#ctl00_cphMain_imgBtnSubmit');

			for(var r = 0; r < namesData.length; r++)
			{
					var item = namesData[r];
					let legalData = item.full_legal;
				if(legalData.includes('LT'))
				{
					await page.waitFor(1000);
					await page.focus('#ctl00_cphMain_txtOwnerName');
					await page.keyboard.type(item.lastname+' '+ item.firstname);
					await page.click('#ctl00_cphMain_btnSearch');
					//await page.waitForNavigation('#ctl00_cphMain_gvParcels > tbody > tr.gv_row');
					await page.waitFor(2000);


					// let tRow1Cnt  = await page.evaluate((sel) => {
					// 	let elements = Array.from(document.querySelectorAll(sel));
					// 	return elements.length;
					// 	}, '#ctl00_cphMain_gvParcels_ctl02_lView');

					// let tRow2Cnt  = await page.evaluate((sel) => {
					// 		let elements = Array.from(document.querySelectorAll(sel));
					// 		return elements.length;
					// 		}, '#ctl00_cphMain_gvParcels_ctl03_lView');

					// let tRow3Cnt  = await page.evaluate((sel) => {
					// 	let elements = Array.from(document.querySelectorAll(sel));
					// 	return elements.length;
					// 	}, '#ctl00_cphMain_gvParcels_ctl04_lView');

					// let tRow4Cnt  = await page.evaluate((sel) => {
					// 	let elements = Array.from(document.querySelectorAll(sel));
					// 	return elements.length;
					// 	}, '#ctl00_cphMain_gvParcels_ctl05_lView');

					// let tRow5Cnt  = await page.evaluate((sel) => {
					// 	let elements = Array.from(document.querySelectorAll(sel));
					// 	return elements.length;
					// 	}, '#ctl00_cphMain_gvParcels_ctl06_lView');
	
					//await page.waitFor(500);

					
					
					await page.waitFor(750);
					//await page.waitForNavigation('#ctl00_cphMain_gvParcels');

					let tableRowCnt  = await page.evaluate((sel) => {
						let elements = Array.from(document.querySelectorAll(sel));
						return elements.length;
						}, '#ctl00_cphMain_gvParcels > tbody > tr.gv_row');

					let tableAltCnt  = await page.evaluate((sel) => {
						let elements = Array.from(document.querySelectorAll(sel));
						return elements.length;
						}, '#ctl00_cphMain_gvParcels > tbody > tr.gv_alt');

						//#ctl00_cphMain_gvParcels > tbody > tr:nth-child(3)
						//#ctl00_cphMain_gvParcels > tbody
					// 	await page.waitFor(1000);
						//#ctl00_cphMain_gvParcels > tbody > tr.gv_row
						// let tableRowCnt = tRow1Cnt + tRow2Cnt + tRow3Cnt + tRow4Cnt + tRow5Cnt + 2;
						tableRowCnt = tableRowCnt+tableAltCnt;
						//console.log(tableRowCnt);

						if(tableRowCnt == 0)
						{
							var json = {'FirstName':item.firstname,'LastName':item.lastname,'County':'Lake','Legal':item.full_legal};
							nomatchPropertyData.push(json);
						}

						tableRowCnt = tableRowCnt + 2;

						for(let q = 2; q <= tableRowCnt;q++)
					    {


							let row = '#ctl00_cphMain_gvParcels_ctl0_INDEX_lView';
							let index = row.replace('_INDEX',q);

							if(q >= 10)
							{
								row = '#ctl00_cphMain_gvParcels_ctl_INDEX_lView';
								index = row.replace('_INDEX',q);
							}

							//console.log(index);
							try
							{
								 if(tableRowCnt > 0)
								 {

									// await page.click('#ctl00_cphMain_gvParcels_ctl02_lView');
									await page.focus(index);
									await page.click(index);
									await page.waitFor(1000);
								}
								// else
								// {
									//await page2.goBack();
									
								// }
								//#ctl00_cphMain_gvParcels_ctl03_lView
							}
							catch(error3)
							{
								//console.log(error3);
								//await page.waitFor(500);
								try
								{
									//console.log("Error");
									await page.focus('#ctl00_cphMain_txtOwnerName');
									await page.keyboard.down('Control');
									await page.keyboard.press('KeyA');
									await page.keyboard.up('Control');
									await page.keyboard.press('Backspace');
									await page.focus('#ctl00_cphMain_txtOwnerName');
								}
								catch(error8)
								{

								}
							}
							let propDescriptionResults = '#content > div.property_section_info > table > tbody > tr:nth-child(8) > td.property_item';
							let prop_description = await page.evaluate((sel) => {
								let element = document.querySelector(sel);
								return element? element.innerHTML:'';
								}, propDescriptionResults);

								let	ownerParts;
								let	mailingAddressParts;
								let	propertyAddressParts = [];
								propertyAddressParts.push(0);
								propertyAddressParts.push(0);
								let propertyAddress;

								if(prop_description.includes(item.lot_number))
								{
									// let ownerNameSelector = '#content > div.property_section_info > table > tbody > tr:nth-child(1) > td:nth-child(2)'
									// let ownerName = await page2.evaluate((sel) => {
									// 	let element = document.querySelector(sel);
									// 	return element? element.innerHTML:'';
									// 	}, ownerNameSelector);
									// ownerParts = ownerName.split(' ');
									//console.log(ownerParts[1] +' '+ ownerParts[0]);

									let mailingAddressSelector = '#content > div.property_section_info > table > tbody > tr:nth-child(2) > td:nth-child(2)'
									let mailingAddress = await page.evaluate((sel) => {
										let element = document.querySelector(sel);
										return element? element.innerHTML:'';
										}, mailingAddressSelector);
									mailingAddressParts = mailingAddress.split('<br>');
									//console.log(mailingAddressParts[0]+ ' ' + mailingAddressParts[1]);

									let propertyAddressSelector = '#content > div.property_section_info > table > tbody > tr:nth-child(6) > td:nth-child(2)'
									propertyAddress = await page.evaluate((sel) => {
										let element = document.querySelector(sel);
										return element? element.innerHTML:'';
										}, propertyAddressSelector);
									propertyAddressParts = propertyAddress.split('<br>');
									//console.log(propertyAddressParts[0]+ ' ' + propertyAddressParts[1]);
								

										let OwnerFirstLast = item.firstname + ' ' + item.lastname;
										let OwnerProperty = '';
										let OwnerMailing = '';

										if(propertyAddress != '')
										{
										OwnerProperty = propertyAddressParts[0]+ ' ' + propertyAddressParts[1];
										}
										if(mailingAddress != '')
										{
											OwnerMailing = mailingAddressParts[0]+ ' ' + mailingAddressParts[1];
										}

										var data = [OwnerFirstLast,OwnerProperty];
										var dataInserted;

										console.log(data);
										
										request = new Request("INSERT INTO LakeCountyProperties with (ROWLOCK) ([Ownername], [Address]) SELECT '"+ data[0].toString()+ "', '"+ data[1].toString()+ "' WHERE NOT EXISTS (SELECT * FROM dbo.LakeCountyProperties WHERE Address = '"+data[1].toString() +"');",
										function(err,rowCount)
										{
										if(err)
										{
											console.log(err);
											}
											//console.log(rowCount + ' row(s) returned');
											dataInserted = rowCount;
										});
										await connection.execSql(request);
								
										if(dataInserted > 0)
										{
											var json = {'ownername':data[0],'propertyaddress':data[1],'mailingaddress':OwnerMailing};
											propertyData.push(json);
											podioJson =  {"fields":{"title":data[0],"lead-source":"Lake County","lead-intake-date":intakeDate,"motivation":7,"status-of-lead":14,"next-action":15,"property-address":data[1],"owners-address":OwnerMailing,"estimated-value":{"value":"0","currency":"USD"},"beds-2":"0","baths-2":"0","square-feet":0,"year-built-2":"0","property-taxes-assement":"0","last-sale-price":"0"}};
											insertPODIOItem(podioJson);
											LakeCnt++;
											

										}
									
										await request.on('done', function (rowCount, more, rows) {
											dataInserted = rowCount;
										});
									}

								//await page.waitFor(500);
								await page.goBack();
								await page.waitFor(1000);
								await page.focus('#ctl00_cphMain_txtOwnerName');
								await page.keyboard.down('Control');
								await page.keyboard.press('KeyA');
								await page.keyboard.up('Control');
								await page.keyboard.press('Backspace');
								await page.focus('#ctl00_cphMain_txtOwnerName');
						}

				}
			}
	}
	catch(error5)
	{
		console.log(error5);
	}
	console.log("Lake Finished with "+ LakeCnt);
	console.log("Started Brevard Names");
	try
	{
	await page.goto('https://vaclmweb1.brevardclerk.us/AcclaimWeb/search/SearchTypeDocType',{waitUntil: 'networkidle2'});

	await page.waitFor(3000);
	// await page2.waitFor(3000);
	try
	{
		await page.focus('#btnButton');
		await page.keyboard.type('\n');
	
		// await page2.focus('#ctl00_cphMain_imgBtnSubmit');
		// await page2.click('#ctl00_cphMain_imgBtnSubmit');
	
		// await page.bringToFront();
	}
	catch(error2)
	{
		 console.log(error2);
	} 
	
	await page.waitFor(4000);
	
	try
	{
		await page.focus('#DocTypesDisplay-input');
		await page.keyboard.type('LIS PENDENS (LP)');
		await page.keyboard.type('\n');
	
	   
	}
	catch(error)
	{
		console.log(error);
	}
	
	// d = new Date();
	 
	  
	// dateString = formatDate(d);
	// dateFirstDayString = formatDateFirstOfMonth(d);
	// dateStringFile = formatDateFile(d);
	// dateFirstDayStringFile = formatDateFirstOfMonthFile(d);
	// intakeDate = formatIntakeDate(d);
	// const sourceData = formatSource(d);
	
	await page.focus('#RecordDateFrom');
	await page.keyboard.down('Control');
	await page.keyboard.press('KeyA');
	await page.keyboard.up('Control');
	await page.keyboard.press('Backspace');
	
	// await page.keyboard.type('11/01/2018'),{delay:1000};
	await page.keyboard.type(dateFirstDayString),{delay:1000};
	  
	await page.focus('#RecordDateTo',{delay:2000});
	await page.keyboard.down('Control');
	await page.keyboard.press('KeyA');
	await page.keyboard.up('Control');
	await page.keyboard.press('Backspace');
	  
	// await page.keyboard.type('12/31/2018'),{delay:1000};
	await page.keyboard.type(dateString),{delay:1000};
	
	await page.waitFor(1000);
	
	await page.click('#btnSearch');
	
	await page.waitFor(5000);
	
	//await page.click('#RsltsGrid > div.t-grid-pager.t-grid-top > div.t-pager.t-reset > div.t-page-size > div > div');
	//await page.keyboard.press('ArrowDown',{delay:250});
	//await page.keyboard.press('ArrowDown',{delay:250});
	//await page.click('body > div:nth-child(11) > div > ul > li:nth-child(2)');
	
	//#RsltsGrid > div.t-grid-pager.t-grid-top > div.t-pager.t-reset > div.t-page-size > div > div > span.t-select > span
	
	pageSelector = '#RsltsGrid > div.t-grid-pager.t-grid-top > div.t-pager.t-reset > div.t-page-i-of-n';
	
	pageNumber = await page.evaluate((sel) => {
		let element = document.querySelector(sel);
		  return element? element.innerHTML:null;
		  }, pageSelector);
	
	await page.waitFor(1500);
	
	pageNumber = pageNumber.replace('Page <input type="text" value="1"> of ','');
	
	// console.log(pageNumber);
	
	
	//#RsltsGrid > div.t-grid-content > table > tbody > tr:nth-child(2) > td:nth-child(4)
	pageGridOne = '#RsltsGrid > div.t-grid-content > table > tbody > tr:nth-child(INDEX_2) > td:nth-child(4)'
	//pageGridOne = pageGridSelector.replace("INDEX",pageGridId);
	pageGridOneRow1 = pageGridOne.replace("INDEX_2","1");
	pageGridOneRow2 = pageGridOne.replace("INDEX_2","2");
	pageGridOneRow3 = pageGridOne.replace("INDEX_2","3");
	pageGridOneRow4 = pageGridOne.replace("INDEX_2","4");
	pageGridOneRow5 = pageGridOne.replace("INDEX_2","5");
	pageGridOneRow6 = pageGridOne.replace("INDEX_2","6");
	pageGridOneRow7 = pageGridOne.replace("INDEX_2","7");
	pageGridOneRow8 = pageGridOne.replace("INDEX_2","8");
	pageGridOneRow9 = pageGridOne.replace("INDEX_2","9");
	pageGridOneRow10 = pageGridOne.replace("INDEX_2","10");
	pageGridOneRow11 = pageGridOne.replace("INDEX_2","11");
	pageGridOneRow12 = pageGridOne.replace("INDEX_2","12");
	pageGridOneRow13 = pageGridOne.replace("INDEX_2","13");
	pageGridOneRow14 = pageGridOne.replace("INDEX_2","14");
	pageGridOneRow15 = pageGridOne.replace("INDEX_2","15");
	pageGridOneRow16 = pageGridOne.replace("INDEX_2","16");
	pageGridOneRow17 = pageGridOne.replace("INDEX_2","17");
	pageGridOneRow18 = pageGridOne.replace("INDEX_2","18");
	pageGridOneRow19 = pageGridOne.replace("INDEX_2","19");
	pageGridOneRow20 = pageGridOne.replace("INDEX_2","20");
	pageGridOneRow21 = pageGridOne.replace("INDEX_2","21");
	pageGridOneRow22 = pageGridOne.replace("INDEX_2","22");
	pageGridOneRow23 = pageGridOne.replace("INDEX_2","23");
	pageGridOneRow24 = pageGridOne.replace("INDEX_2","24");
	pageGridOneRow25 = pageGridOne.replace("INDEX_2","25");
	pageGridOneRow26 = pageGridOne.replace("INDEX_2","26");
	pageGridOneRow27 = pageGridOne.replace("INDEX_2","27");
	pageGridOneRow28 = pageGridOne.replace("INDEX_2","28");
	pageGridOneRow29 = pageGridOne.replace("INDEX_2","29");
	pageGridOneRow30 = pageGridOne.replace("INDEX_2","30");
	pageGridOneRow31 = pageGridOne.replace("INDEX_2","31");
	pageGridOneRow32 = pageGridOne.replace("INDEX_2","32");
	pageGridOneRow33 = pageGridOne.replace("INDEX_2","33");
	pageGridOneRow34 = pageGridOne.replace("INDEX_2","34");
	pageGridOneRow35 = pageGridOne.replace("INDEX_2","35");
	pageGridOneRow36 = pageGridOne.replace("INDEX_2","36");
	pageGridOneRow37 = pageGridOne.replace("INDEX_2","37");
	pageGridOneRow38 = pageGridOne.replace("INDEX_2","38");
	pageGridOneRow39 = pageGridOne.replace("INDEX_2","39");
	pageGridOneRow40 = pageGridOne.replace("INDEX_2","40");
	pageGridOneRow41 = pageGridOne.replace("INDEX_2","41");
	pageGridOneRow42 = pageGridOne.replace("INDEX_2","42");
	pageGridOneRow43 = pageGridOne.replace("INDEX_2","43");
	pageGridOneRow44 = pageGridOne.replace("INDEX_2","44");
	pageGridOneRow45 = pageGridOne.replace("INDEX_2","45");
	pageGridOneRow46 = pageGridOne.replace("INDEX_2","46");
	pageGridOneRow47 = pageGridOne.replace("INDEX_2","47");
	pageGridOneRow48 = pageGridOne.replace("INDEX_2","48");
	pageGridOneRow49 = pageGridOne.replace("INDEX_2","49");
	pageGridOneRow50 = pageGridOne.replace("INDEX_2","50");
	
	pageNumber = pageNumber-1;
	 
	for (let i = 0; i <= pageNumber ; i++) 
	{
	
	  if(i > 0)
	  { 
		 await page.focus('#RsltsGrid > div.t-grid-pager.t-grid-top > div.t-pager.t-reset > a:nth-child(6)',{delay:1000});
		 await page.click('#RsltsGrid > div.t-grid-pager.t-grid-top > div.t-pager.t-reset > a:nth-child(6)',{delay:1000});
		 await page.waitFor(1000);
		 //await page2.bringToFront();
	  }
	
	boxResult1  = await page.evaluate((sel) => {
		let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow1);
	//console.log(boxResult1);
	
	boxResult2  = await page.evaluate((sel) => {
		  let elements = Array.from(document.querySelectorAll(sel));
			return elements.length;
	}, pageGridOneRow2);
	//console.log(boxResult2);
	
	boxResult3  = await page.evaluate((sel) => {
		  let elements = Array.from(document.querySelectorAll(sel));
			return elements.length;
	}, pageGridOneRow3);
	//console.log(boxResult3);
	
	boxResult4  = await page.evaluate((sel) => {
		 let elements = Array.from(document.querySelectorAll(sel));
		   return elements.length;
	}, pageGridOneRow4);
	//console.log(boxResult4);
	
	boxResult5  = await page.evaluate((sel) => {
	   let elements = Array.from(document.querySelectorAll(sel));
		 return elements.length;
	}, pageGridOneRow5);
	//console.log(boxResult5);
	
	boxResult6  = await page.evaluate((sel) => {
		  let elements = Array.from(document.querySelectorAll(sel));
			return elements.length;
	}, pageGridOneRow6);
	//console.log(boxResult6);
	
	boxResult7  = await page.evaluate((sel) => {
		 let elements = Array.from(document.querySelectorAll(sel));
		   return elements.length;
	}, pageGridOneRow7);
	//console.log(boxResult7);
	
	boxResult8  = await page.evaluate((sel) => {
		  let elements = Array.from(document.querySelectorAll(sel));
		  return elements.length;
	}, pageGridOneRow8);
	//console.log(boxResult8);
	
	boxResult9  = await page.evaluate((sel) => {
		  let elements = Array.from(document.querySelectorAll(sel));
		   return elements.length;
	}, pageGridOneRow9);
	//console.log(boxResult9);
	
	boxResult10  = await page.evaluate((sel) => {
		 let elements = Array.from(document.querySelectorAll(sel));
		   return elements.length;
	}, pageGridOneRow10);
	//console.log(boxResult10);
	
    boxResult11  = await page.evaluate((sel) => {
		let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow11);
	//console.log(boxResult1);
	
	boxResult12  = await page.evaluate((sel) => {
		  let elements = Array.from(document.querySelectorAll(sel));
			return elements.length;
	}, pageGridOneRow12);
	//console.log(boxResult2);
	
	boxResult13  = await page.evaluate((sel) => {
		  let elements = Array.from(document.querySelectorAll(sel));
			return elements.length;
	}, pageGridOneRow13);
	//console.log(boxResult3);
	
	boxResult14  = await page.evaluate((sel) => {
		let elements = Array.from(document.querySelectorAll(sel));
		  return elements.length;
	}, pageGridOneRow14);
	//console.log(boxResult4);
	
	boxResult15  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow15);
	//console.log(boxResult5);
	
	boxResult16  = await page.evaluate((sel) => {
		  let elements = Array.from(document.querySelectorAll(sel));
			return elements.length;
	}, pageGridOneRow16);
	//console.log(boxResult6);
	
	boxResult17  = await page.evaluate((sel) => {
		let elements = Array.from(document.querySelectorAll(sel));
		  return elements.length;
	}, pageGridOneRow17);
	//console.log(boxResult7);
	
	boxResult18  = await page.evaluate((sel) => {
		  let elements = Array.from(document.querySelectorAll(sel));
		  return elements.length;
	}, pageGridOneRow18);
	//console.log(boxResult8);
	
	boxResult19  = await page.evaluate((sel) => {
		  let elements = Array.from(document.querySelectorAll(sel));
		  return elements.length;
	}, pageGridOneRow19);
	//console.log(boxResult9);
	
	boxResult20  = await page.evaluate((sel) => {
		let elements = Array.from(document.querySelectorAll(sel));
		  return elements.length;
	}, pageGridOneRow20);
	//console.log(boxResult10);
	
	boxResult21  = await page.evaluate((sel) => {
		let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow21);
	//console.log(boxResult1);
	
	boxResult22  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow22);
	//console.log(boxResult2);
	
	boxResult23  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow23);
	//console.log(boxResult3);
	
	boxResult24  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow24);
	//console.log(boxResult4);
	
	boxResult25  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
	}, pageGridOneRow25);
	//console.log(boxResult5);
	
	boxResult26  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow26);
	//console.log(boxResult6);
	
	boxResult27  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow27);
	//console.log(boxResult7);
	
	boxResult28  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow28);
	//console.log(boxResult8);
	
	boxResult29  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow29);
	//console.log(boxResult9);
	
	boxResult30  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow30);
	//console.log(boxResult10);
	
	let boxResult31  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
	}, pageGridOneRow31);
	//console.log(boxResult1);
	
	let boxResult32  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow32);
	//console.log(boxResult2);
	
	boxResult33  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow33);
	//console.log(boxResult3);
	
	boxResult34  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow34);
	//console.log(boxResult4);
	
	boxResult35  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
	}, pageGridOneRow35);
	//console.log(boxResult5);
	
	boxResult36  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow36);
	//console.log(boxResult6);
	
	boxResult37  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow37);
	//console.log(boxResult7);
	
	boxResult38  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow38);
	//console.log(boxResult8);
	
	boxResult39  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow39);
	//console.log(boxResult9);
	
	boxResult40  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow40);
	//console.log(boxResult10);
	
	boxResult41  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
	}, pageGridOneRow41);
	//console.log(boxResult1);
	
	boxResult42  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow42);
	//console.log(boxResult2);
	
	boxResult43  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow43);
	//console.log(boxResult3);
	
	boxResult44  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow44);
	//console.log(boxResult4);
	
	boxResult45  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	return elements.length;
	}, pageGridOneRow45);
	//console.log(boxResult5);
	
	boxResult46  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
		return elements.length;
	}, pageGridOneRow46);
	//console.log(boxResult6);
	
	boxResult47  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow47);
	//console.log(boxResult7);
	
	boxResult48  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow48);
	//console.log(boxResult8);
	
	boxResult49  = await page.evaluate((sel) => {
	  let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow49);
	//console.log(boxResult9);
	
	boxResult50  = await page.evaluate((sel) => {
	let elements = Array.from(document.querySelectorAll(sel));
	  return elements.length;
	}, pageGridOneRow50);
	
		 boxNumbers = (boxResult1+boxResult2+boxResult3+boxResult4+boxResult5+boxResult6+boxResult7+boxResult8+boxResult9+boxResult10+
		boxResult11+boxResult12+boxResult13+boxResult14+boxResult15+boxResult16+boxResult17+boxResult18+boxResult19+boxResult20+
		boxResult21+boxResult22+boxResult23+boxResult24+boxResult25+boxResult26+boxResult27+boxResult28+boxResult29+boxResult30+
		boxResult31+boxResult32+boxResult33+boxResult34+boxResult35+boxResult36+boxResult37+boxResult38+boxResult39+boxResult40+
		boxResult41+boxResult42+boxResult43+boxResult44+boxResult45+boxResult46+boxResult47+boxResult48+boxResult49+boxResult50
	  );
		  boxNumbers  = boxNumbers -1;
	
		  nameResults = '#RsltsGrid > div.t-grid-content > table > tbody > tr:nth-child(INDEX_2) > td:nth-child(4)'
		  legalResults = '#RsltsGrid > div.t-grid-content > table > tbody > tr:nth-child(INDEX_2) > td:nth-child(11)'
		//#RsltsGrid > div.t-grid-content > table > tbody > tr:nth-child(2) > td:nth-child(11)
	
		  for (let i = 0; i <= boxNumbers ; i++) 
		{
	
			let nameSelector = nameResults.replace("INDEX_2",(i+1));
			let legalSelector = legalResults.replace("INDEX_2",(i+1));
	
				let name_result = await page.evaluate((sel) => {
					let element = document.querySelector(sel);
					return element? element.innerHTML:null;
					}, nameSelector);
	
				let legal_result = await page.evaluate((sel) => {
					let element = document.querySelector(sel);
					return element? element.innerHTML:null;
					}, legalSelector);
			//console.log(name_result);
			//console.log(legal_result);
	
			var OwnerParts = name_result.split(',');
	
			var OwnerFirstName = "";
			var OwnerLastName = "";
	
			OwnerFirstName = OwnerParts[1];
			OwnerLastName = OwnerParts[0];
	
			var legalPart = legal_result.split(' ');
			var lotNumber = "";
			
			for(let j = 0;j < legalPart.length;j++)
			{
				if(legalPart[j] == 'LT')
				{
					lotNumber = legalPart[(j+1)];
					lotNumber = 'Lot ' + lotNumber;
				}
				else if(legalPart[j] == 'LTS')
				{
					lotNumber = legalPart[(j+1)];
					lotNumber = 'Lots ' + lotNumber;
				}
			}
			var name = {'firstname':OwnerFirstName,'lastname':OwnerLastName,'lot_number':lotNumber,'full_legal':legal_result,'county':'brevard'};
			namesData.push(name);
			brevardNamesData.push(name);
			// console.log(name);
			
		
	
		}
		
	
	}
}
catch(brevardError)
{
	console.log(brevardError);
}

	console.log("Finished Brevard Names");
    console.log("Started Brevard Property Search");
	try
	{
	
				await page.goto('https://www.bcpao.us/PropertySearch/#/nav/Search',{waitUntil: 'networkidle2'});
				// await page2.bringToFront();
	
				await page.waitFor(4000);
	
				// await page.focus('#ctl00_cphMain_imgBtnSubmit');
				// await page.click('#ctl00_cphMain_imgBtnSubmit');
	
				for(var r = 0; r < brevardNamesData.length; r++)
				{
						var item = brevardNamesData[r];
						let legalData = item.full_legal;
					if(legalData.includes('LT'))
					{
						await page.waitFor(1000);
						await page.focus('#txtPropertySearch_Owner');
						await page.keyboard.type(item.lastname +','+ item.firstname);
						await page.click('#btnPropertySearch_RealProperty_Go');
						//await page.waitForNavigation('#ctl00_cphMain_gvParcels > tbody > tr.gv_row');
						await page.waitFor(2000);
	
	
					   
	
						// let tRow1Cnt  = await page.evaluate((sel) => {
						// 	let elements = Array.from(document.querySelectorAll(sel));
						// 	return elements.length;
						// 	}, '#ctl00_cphMain_gvParcels_ctl02_lView');
	
						// let tRow2Cnt  = await page.evaluate((sel) => {
						// 		let elements = Array.from(document.querySelectorAll(sel));
						// 		return elements.length;
						// 		}, '#ctl00_cphMain_gvParcels_ctl03_lView');
	
						// let tRow3Cnt  = await page.evaluate((sel) => {
						// 	let elements = Array.from(document.querySelectorAll(sel));
						// 	return elements.length;
						// 	}, '#ctl00_cphMain_gvParcels_ctl04_lView');
	
						// let tRow4Cnt  = await page.evaluate((sel) => {
						// 	let elements = Array.from(document.querySelectorAll(sel));
						// 	return elements.length;
						// 	}, '#ctl00_cphMain_gvParcels_ctl05_lView');
	
						// let tRow5Cnt  = await page.evaluate((sel) => {
						// 	let elements = Array.from(document.querySelectorAll(sel));
						// 	return elements.length;
						// 	}, '#ctl00_cphMain_gvParcels_ctl06_lView');
		
						//await page.waitFor(500);
	
						
						
							await page.waitFor(750);
						//await page.waitForNavigation('#ctl00_cphMain_gvParcels');
	
						let tableRowCnt  = await page.evaluate((sel) => {
							let elements = Array.from(document.querySelectorAll(sel));
							return elements.length;
							}, '#tblSearchResults > tbody > tr');
	
							await page.waitFor(750);
							// let tableAltCnt  = await page.evaluate((sel) => {
							// 	let elements = Array.from(document.querySelectorAll(sel));
							// 	return elements.length;
							// 	}, '#ctl00_cphMain_gvParcels > tbody > tr.gv_alt');
	
							//#ctl00_cphMain_gvParcels > tbody > tr:nth-child(3)
							//#ctl00_cphMain_gvParcels > tbody
							// 	await page.waitFor(1000);
							//#ctl00_cphMain_gvParcels > tbody > tr.gv_row
							// let tableRowCnt = tRow1Cnt + tRow2Cnt + tRow3Cnt + tRow4Cnt + tRow5Cnt + 2;
							//tableRowCnt = tableRowCnt+tableAltCnt;
							console.log(tableRowCnt);
							if(tableRowCnt == 0)
							{
								var json = {'FirstName':item.firstname,'LastName':item.lastname,'County':'Brevard','Legal':item.full_legal};
								nomatchPropertyData.push(json);

								// await page.goBack();
								// await page.waitFor(3000);
								// await page.focus('#txtPropertySearch_Owner');
								// await page.keyboard.down('Control');
								// await page.keyboard.press('KeyA');
								// await page.keyboard.up('Control');
								// await page.keyboard.press('Backspace');
								// await page.focus('#txtPropertySearch_Owner');
							}
							
							if(tableRowCnt > 1)
							{
								await page.focus('#Results_PerPage > select');
								await page.keyboard.press('ArrowDown',{delay:250});
								await page.keyboard.press('ArrowDown',{delay:250});
								await page.keyboard.press('ArrowDown',{delay:250});
							}
	
	
							
	
							//tableRowCnt = tableRowCnt + 2;
	
							for(let q = 1; q <= tableRowCnt; q++)
							{
	
								
								let row = '#tblSearchResults > tbody > tr:nth-child(_INDEX) > td:nth-child(3)';
								let index = row.replace('_INDEX', q);
	
								//console.log(index);
								try
								{
									 if(tableRowCnt > 1)
									 {
										// await page.click('#ctl00_cphMain_gvParcels_ctl02_lView');
										await page.focus(index);
										await page.click(index);
										await page.waitFor(3000);
									}
									// else
									// {
										//await page2.goBack();
										
									// }
									//#ctl00_cphMain_gvParcels_ctl03_lView
								}
								catch(error3)
								{
									//console.log(error3);
									//await page.waitFor(500);
									try
									{
										//console.log("Error");
										// await page.focus('#txtPropertySearch_Owner');
										// await page.keyboard.down('Control');
										// await page.keyboard.press('KeyA');
										// await page.keyboard.up('Control');
										// await page.keyboard.press('Backspace');
										// await page.focus('#txtPropertySearch_Owner');
									}
									catch(error8)
									{
	
									}
								}                             
								let propDescriptionResults = '#cssDetails_Top_Outer > div.cssDetails_TopContainer.cssTableContainer.cssOverFlow_x > div > div:nth-child(12) > div.cssDetails_Top_Cell_Data';
								let prop_description = await page.evaluate((sel) => {
									let element = document.querySelector(sel);
									return element? element.innerHTML:'';
									}, propDescriptionResults);
	
									let	ownerParts;
									let	mailingAddressParts;
									let	propertyAddressParts = [];
									propertyAddressParts.push(0);
									propertyAddressParts.push(0);
									let propertyAddress;
									
									//console.log(prop_description);
	
									if(prop_description.includes(item.lot_number))
									{
										// let ownerNameSelector = '#content > div.property_section_info > table > tbody > tr:nth-child(1) > td:nth-child(2)'
										// let ownerName = await page2.evaluate((sel) => {
										// 	let element = document.querySelector(sel);
										// 	return element? element.innerHTML:'';
										// 	}, ownerNameSelector);
										// ownerParts = ownerName.split(' ');
										//console.log(ownerParts[1] +' '+ ownerParts[0]);
	
										let mailingAddressSelector = '#cssDetails_Top_Outer > div.cssDetails_TopContainer.cssTableContainer.cssOverFlow_x > div > div:nth-child(2) > div.cssDetails_Top_Cell_Data'
										let mailingAddress = await page.evaluate((sel) => {
											let element = document.querySelector(sel);
											return element? element.innerHTML:'';
											}, mailingAddressSelector);
										mailingAddressParts = mailingAddress.split('\n');
										// console.log(mailingAddress);
										//console.log(mailingAddressParts[0]+ ' ' + mailingAddressParts[1]);
	
										let propertyAddressSelector = '#divDetails_Top_SiteAddressContainer > div'
										propertyAddress = await page.evaluate((sel) => {
											let element = document.querySelector(sel);
											return element? element.innerHTML:'';
											}, propertyAddressSelector);
										// console.log(propertyAddress);
										//propertyAddressParts = propertyAddress.split(' ');
										//console.log(propertyAddressParts[0]+ ' ' + propertyAddressParts[1]);
									
	
											let OwnerFirstLast = item.firstname + ' ' + item.lastname;
											let OwnerProperty = '';
											let OwnerMailing = '';
	
											if(propertyAddress != '')
											{
												OwnerProperty = propertyAddress;//Parts[0]+ ' ' + propertyAddressParts[1];
											}
											if(mailingAddress != '')
											{
												OwnerMailing = mailingAddressParts[0] + mailingAddressParts[1];
											}
	
											var data = [OwnerFirstLast,OwnerProperty];
											var dataInserted;
	
											console.log(data);
											
											request = new Request("INSERT INTO LakeCountyProperties with (ROWLOCK) ([Ownername], [Address]) SELECT '"+ data[0].toString()+ "', '"+ data[1].toString()+ "' WHERE NOT EXISTS (SELECT * FROM dbo.LakeCountyProperties WHERE Address = '"+data[1].toString() +"');",
											function(err,rowCount)
											{
											if(err)
											{
												console.log(err);
												}
												//console.log(rowCount + ' row(s) returned');
												dataInserted = rowCount;
											});
											await connection.execSql(request);
									
											if(dataInserted > 0)
											{
												var json = {'ownername':data[0],'propertyaddress':data[1],'mailingaddress':OwnerMailing};
												// console.log(json);
												propertyData.push(json);
												podioJson =  {"fields":{"title":data[0],"lead-source":"Brevard County","lead-intake-date":intakeDate,"motivation":7,"status-of-lead":14,"next-action":15,"property-address":data[1],"owners-address":OwnerMailing,"estimated-value":{"value":"0","currency":"USD"},"beds-2":"0","baths-2":"0","square-feet":0,"year-built-2":"0","property-taxes-assement":"0","last-sale-price":"0"}};
												insertPODIOItem(podioJson);
												BrevardCnt++;
	
											}
										
											await request.on('done', function (rowCount, more, rows) {
												dataInserted = rowCount;
											});
									}   
	
									await page.waitFor(500);
								   
									if(tableRowCnt == q)
									{
										
										//await page.goBack();
										//await page.waitFor(2000);
										await page.click('#divPropertySearch_TabBar > a:nth-child(1)');
										await page.waitFor(1000);
										await page.focus('#txtPropertySearch_Owner');
										await page.keyboard.down('Control');
										await page.keyboard.press('KeyA');
										await page.keyboard.up('Control');
										await page.keyboard.press('Backspace');
										await page.focus('#txtPropertySearch_Owner');
									}
									else
									{
										//await page.goBack();
										await page.click('#divPropertySearch_TabBar > a:nth-child(2)');
										await page.waitFor(500);
									}
								   
								}
								if(tableRowCnt == 0)
								{
										await page.click('#divPropertySearch_TabBar > a:nth-child(1)');
										await page.waitFor(1000);
										await page.focus('#txtPropertySearch_Owner');
										await page.keyboard.down('Control');
										await page.keyboard.press('KeyA');
										await page.keyboard.up('Control');
										await page.keyboard.press('Backspace');
										await page.focus('#txtPropertySearch_Owner');
								}
							
	
					}
					else
					{
						var json = {'FirstName':item.firstname,'LastName':item.lastname,'County':'Brevard','Legal':item.full_legal};
						nomatchPropertyData.push(json);
					}
				}
		}
		catch(error5)
		{
			console.log(error5);
		}

	var fileName = 'Names ' + dateFirstDayStringFile + ' to ' + dateStringFile + ' LP.csv';
	var fileName2 = 'Properties ' + dateFirstDayStringFile + ' to ' + dateStringFile + ' LP.csv';
	var fileName3 = 'No Match ' + dateFirstDayStringFile + ' to ' + dateStringFile + ' LP.csv';
  
	var fileNameLetterOne = dateFirstDayStringFile + ' to ' + dateStringFile + ' LP Letter 1.docx';

	var fileNameLetterTwo = dateFirstDayStringFile + ' to ' + dateStringFile + ' LP Letter 2.docx';	

	var json2csvCallback = function (err, csv) 
    {
    if (err) throw err;
    //console.log(csv);
	
    fs.writeFile(fileName, csv, function(err) 
    {
      if (err) throw err;
      console.log('Names file saved');
	    csvNames = csv;    
      });
	}; 
	
	var json2csvCallback2 = function (err, csv) 
    {
    if (err) throw err;
    //console.log(csv);
	
    fs.writeFile(fileName2, csv, function(err) 
    {
      if (err) throw err;
      console.log('Properties file saved');
	  	csvProperty = csv;    
      });
	}; 
	
	var json2csvCallback3 = function (err, csv) 
    {
    if (err) throw err;
    //console.log(csv);
	
    fs.writeFile(fileName3, csv, function(err) 
    {
      if (err) throw err;
      console.log('No Match file saved');
	  	csvNoMatchProperty = csv;    
      });
    }; 

    console.log('Lake County Count: '+LakeCnt);
	console.log('Brevard County Count: '+BrevardCnt);

	var template = fs.readFileSync(path.resolve(__dirname,'lis_pendons_template.docx'),'binary');
    var zip = new JSZip(template);

    var doc = new Docxtemplater();
    //doc.setOptions({paragraphLoop: true});
    doc.loadZip(zip);

    var loopData = {'letters':propertyData};

    //console.log(loopData)

    doc.setData(loopData);

    try{
        doc.render();
    }
    catch(error){
        var e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties:error.properties,
        }
        console.log(JSON.stringify({error:e}));
        throw error;
    }

    buf = doc.getZip().generate({type:'nodebuffer'});

    await fs.writeFileSync(path.resolve(__dirname,fileNameLetterOne),buf);

	var template2 = fs.readFileSync(path.resolve(__dirname,'lis_pendons_template2.docx'),'binary');
    var zip2 = new JSZip(template2);

    var doc2 = new Docxtemplater();
    doc2.loadZip(zip2);

    var loopData2 = {'letters':propertyData};

    //console.log(loopData)

    doc2.setData(loopData2);

    try{
        doc2.render();
    }
    catch(error){
        var e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties:error.properties,
        }
        console.log(JSON.stringify({error:e}));
        throw error;
    }

    buf2 = doc2.getZip().generate({type:'nodebuffer'});

    await fs.writeFileSync(path.resolve(__dirname,fileNameLetterTwo),buf2);

	await converter.json2csv(namesData, json2csvCallback);

	await converter.json2csv(propertyData, json2csvCallback2);

	await converter.json2csv(nomatchPropertyData, json2csvCallback3);

	await page.waitFor(2000);
	if(propertyData.length == 0)
	{
		sendZeroResultsEmail();
	}
	else
	{
		await sendTheEmail(fileName,fileName2,fileName3,fileNameLetterOne,fileNameLetterTwo);
	}

  	await page.waitFor(1500);

	await browser.close();

	await connection.close();

}



function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1)+'/',
        day = '' + d.getDate()+'/',
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day,year].join('');
}

function formatDateFirstOfMonthFile(date){
	var d = new Date(date),
	month = '' + (d.getMonth()),
	day = '01',
	year = d.getFullYear();
	
	if (month.length < 2) month = '0' + month;
	if (month == '00') month = '01';
	return [month, day,year].join('');
}

function formatDateFile(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day,year].join('');
}

function formatDateFirstOfMonth(date){
	var d = new Date(date),
	month = '' + (d.getMonth())+'/',
	day = '01/',
	year = d.getFullYear();
	
	if (month.length < 2) month = '0' + month;
	if (month == '0/') month = '1/';
	return [month, day,year].join('');
}

function formatIntakeDate(date){
var d = new Date(date),
	month = '' + (d.getMonth() + 1),
	day = '' + d.getDate(),
	year = d.getFullYear(),
	hour = '' + d.getHours(), 
	minute = '' + d.getMinutes(),
	second = '' + d.getSeconds(); 
	
 
	if (hour.length == 1) { hour = '0' + hour; }
	if (minute.length == 1) { minute = "0" + minute; }
	if (second.length == 1) { second = "0" + second; }
	if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
	
	//return [year, month, day].join('-');
	return [year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second];
	
}


function formatSource(date){
	var d = new Date(date),
	year = d.getFullYear(),
    locale = "en-us",
    month = d.toLocaleString(locale, { month: "long" });
	
	return [year + ' ' + month + ' LIS PENDENS'];
}

function sendZeroResultsEmail()
{
	
	// Set the refresh token
oauth2Client.setCredentials({
	refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

//Initialize an access token variable
let accessToken = "";

//Get the access token
oauth2Client.refreshAccessToken(function(err,tokens)
{
	if(err) 
	{
		console.log(err);
	  } 
	  else 
	  {
		console.log(accessToken);
	  }
	accessToken = tokens.access_token;
});

var smtpTransport = nodemailer.createTransport({
    host:"smtp.gmail.com",
	port: 465,
	secure: true,
	auth:{
      type: "OAuth2",
      user: process.env.GMAIL_USERNAME,
	  clientId: process.env.GMAIL_CLIENTID,
	  clientSecret: process.env.GMAIL_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
	  accessToken: accessToken
    }
});

	var mailOptions = {
	  from: process.env.GMAIL_USERNAME,
	  to: "Kornarmy@gmail.com, mfilson148@gmail.com",
	  subject: "Lake County and Brevard LP Mailer list No Results",
	  generateTextFromHTML: true,
	  html: "<b>Lake County Found zero results today.</b>",
	  //attachments: [{   filename: 'Testfile.csv',// file on disk as an attachment
		//				content: thecsv
		//			}]
	};

	smtpTransport.sendMail(mailOptions, function(error, response) {
	  if (error) {
		console.log(error);
	  } else {
		console.log(response);
	  }
	  smtpTransport.close();
	});
	
};

function sendTheEmail(fileName,fileName2,fileName3,fileNameLetterOne,fileNameLetterTwo)
{
	
// Set the refresh token
oauth2Client.setCredentials({
	refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

//Initialize an access token variable
let accessToken = "";

//Get the access token
oauth2Client.refreshAccessToken(function(err,tokens)
{
if(err) 
{
    console.log(err);
  } 
  else 
  {
    console.log(accessToken);
  }
	accessToken = tokens.access_token;
});

var smtpTransport = nodemailer.createTransport({
    host:"smtp.gmail.com",
	port: 465,
	secure: true,
	auth:{
      type: "OAuth2",
      user: process.env.GMAIL_USERNAME,
	  clientId: process.env.GMAIL_CLIENTID,
	  clientSecret: process.env.GMAIL_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
	  accessToken: accessToken
    }
});

var mailOptions = {
  from: process.env.GMAIL_USERNAME,
  to: "Kornarmy@gmail.com, mfilson148@gmail.com, list@divlink.com",
  //, list@divlink.com",
  subject: "Lake and Brevard LP",
  generateTextFromHTML: true,
  html: "<b>Lake County and Brevard County LIS PENDONS From the machines!</b>",
  attachments: [{   filename: fileName,// file on disk as an attachment
					content: csvNames }
				,{filename: fileName2,
					content: csvProperty}
				,{filename: fileName3,
					content: csvNoMatchProperty}
       		 	,{filename: fileNameLetterOne,
          			content:  buf }
          		,{filename: fileNameLetterTwo,
            		content:  buf2 }]
};

smtpTransport.sendMail(mailOptions, function(error, response) {
  if (error) {
    console.log(error);
  } else {
    console.log(response);
  }
  smtpTransport.close();
});
	
};

function insertPODIOItem(item)
{
	//get the API id/secret
	const clientId = process.env.PODIO_CLIENTID;
    const clientSecret = process.env.PODIO_CLIENT_SECRET;

	//get the app ID and Token for appAuthentication
	const appId = process.env.PODIO_APPID;
	const appToken = process.env.PODIO_APPTOKEN;

	// instantiate the SDK
	const podio = new Podio({
	authType: 'app',
	clientId: clientId,
	clientSecret: clientSecret
	});

	podio.authenticateWithApp(appId, appToken, (err) => {

	if (err) throw new Error(err);

	podio.isAuthenticated().then(() => {
		
    var requestData = {data: true};
	requestData = item;
    // Ready to make API calls in here...
	podio.request('POST', '/item/app/'+ process.env.PODIO_APPID +'/',requestData,function(responseData)
		{
			console.log('my responce: ',responseData);
		}).catch(err => console.log(err));

	}).catch(err => console.log(err));

});

}

getLakeCountyData();