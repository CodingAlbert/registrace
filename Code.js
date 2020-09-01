//function onOpen() {
//  var date = new Date()
//  var currentSheet = SpreadsheetApp.GetActive()
////  var answersSheet = SpreadsheetApp.getActive().getSheetByName('answers')
// var testSheet = SpreadsheetApp.getActive().getSheetByName('TestTab')
//
//  var range = answersSheet.getRange(2,1,2,16)//2, A, y, x //
//  var ansValues = range.getValues()
// 
//  var testSheetRange = testSheet.getRange(2,1,2,16)//2, A, y, x
//  testSheetRange.setValues(ansValues)
//  
//  console.log(currentSheet) 
//}
//*********************************************************************************************

function onFormSubmit() {
  //Gets all the sheets - 'answers', 'answersProcessed', 'TestSheet'
  var answersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('answers')
  var testSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('TestTab')
  var processedSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('answersProcessed')
  
  //Gets the last recorded row number of 'answers'
  var lastRowAnswersNUMBER = answersSheet.getLastRow()
  //console.log(lastRowProcessedSheetNUMBER)
  
  //Creates a new line in answersProcessed sheet with all the necessary formulas generated for that line
  var lineNumber = lastRowAnswersNUMBER
  
  var childrenColumns = []
   for (var i = 0; i<=15; i++) {
    var columnLetters = ["B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q"]
    var childrenColumn = columnLetters[i] + lineNumber
    childrenColumns.push(childrenColumn)
   }
  console.log(childrenColumns + ' childrenColumns')
  
  var childrenFormulas = []
  for (var i = 0; i<=15; i++) {
    var childrenFormula = "=IF(answers!"+childrenColumns[i]+"=\"Absence\",\"A\",\"1\")"
    childrenFormulas.push(childrenFormula)
  }
  console.log(childrenFormulas + ' - childrenFormulas')
 
  var formulas = ["=IF(ISBLANK(C"+lineNumber+"), \"\", ISOWEEKNUM(C"+lineNumber+"))", "=IF(ISBLANK(C"+lineNumber+"), \"\", WEEKDAY(C"+lineNumber+"))", "=answers!A"+lineNumber, "=LEFT(answers!R"+lineNumber+",SEARCH(\"@zslivingston.cz\",answers!R"+lineNumber+")-1)"]  
  formulas.splice.apply(formulas,[3, 0].concat(childrenFormulas))
  console.log(formulas + ' -formulas!!!')
  
  var processedSheetFormulaRange = processedSheet.getRange(lineNumber,1,1,20) // 'A2:T2'
  for (i = 0; i<=19; i++) {
    console.log(i + '. loop of writing into processed Range')
    processedSheetFormulaRange.setFormulas([formulas])
  }
    
  //Picks up the last recorded rows first value, aka week number.
  var lastRowProcessedSheetRange = processedSheet.getRange(lineNumber, 1, 1, 18) //'Bx,Sx' lastRowProcessedSheetNUMBER
  var lastRowProcessedSheetValues = lastRowProcessedSheetRange.getValues()
  var lastRowProcessedWeekValue = lastRowProcessedSheetRange.getValue()
  //console.log(lastRowProcessedSheetValues)

  //Picks up the last recorded rows values
  var lastRowRange = answersSheet.getRange(lastRowAnswersNUMBER, 1, 1, 17)
  var lastRowValues = lastRowRange.getValues()
  
  //Sets Range of Presence only from last row of the processed sheet and loads the values
  var lastRowAnsTodayPresenceRange = processedSheet.getRange(lastRowAnswersNUMBER, 4, 1, 17) //'Dx:Rx'
  var lastRowAnsTodayPresence = lastRowAnsTodayPresenceRange.getValues()
  
  console.log(lastRowAnsTodayPresence[0] + ' - lastRowAnsTodayPresence[0] //This is today presence array')
  console.log(lastRowProcessedSheetValues[0][1] + ' - lastRowProcessedSheetValues[0][1] //This is day of the week for today presence')
  console.log(lastRowAnsTodayPresence[0][0] + ' - lastRowAnsTodayPresence[0][0] //This is first value of todays presence')
  console.log(lastRowAnsTodayPresence[0][15] + ' - lastRowAnsTodayPresence[0][15] //This is last value of todays presence')
  console.log(lastRowAnsTodayPresence[0].length + ' - lastRowAnsTodayPresence[0].length //This is the length of todays presence array')
  
  // Checks which week sheet the last record fits and retrieves the correct week sheet.
  for (var W = 34; W<=37; W++ ) {    
    var w = W.toString()
    var weekSheetName = 'Týden ' + w
    console.log(weekSheetName)
    var weekSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(weekSheetName)
    //Gets the values of days of the week
    var daysOfWeekRange = weekSheet.getRange(2,2,1,6) //'B2:G2'
    var daysOfWeekValues = daysOfWeekRange.getValues()
    
    console.log(daysOfWeekValues + ' - daysOfWeekValues //These are all values in Days of the week array')
    console.log(daysOfWeekValues[0][0] + ' - daysOfWeekValues[0][0] //This is the first value in the days of the week array, '+ daysOfWeekValues[0][1] + ' - This is the second value in the days of the week array, ' + daysOfWeekValues[0][5] + ' - This is the last value in the days of the week array ')
    console.log(daysOfWeekValues[0].length + ' - daysOfWeekValues[0].length //This is the length of the days of the week array')
    
    if (lastRowProcessedWeekValue == W) {   
      //Reads the day of the week of the Week 34 sheet
      for (var i=2; i<=7; i++) {
        var weekRecordRange = weekSheet.getRange(3,i,17,1) //'B3:B19', 'C3:B19', etc.
        console.log(weekRecordRange.getValues() + '- week34RecordRange.getValues() //This is the record range as it changes')
      
        for (var j=0; j<daysOfWeekValues[0].length; j++){
          var currentDay = i
          if (lastRowProcessedSheetValues[0][1] == currentDay) {
            lastRowAnsTodayPresenceRange.copyTo(weekRecordRange, SpreadsheetApp.CopyPasteType.PASTE_VALUES, true) //  'yeah'
            console.log(lastRowAnsTodayPresence[0] + ' - lastRowAnsTodayPresence[0] //This is presence value as it goes through increment'); //'yep'
            console.log(daysOfWeekValues[0][j] + ' - daysOfWeekValues[0][j] //This is the increments of day value inside last if')
            console.log(lastRowProcessedSheetValues[0][1] + ' - lastRowProcessedSheetValues[0][1] //This is day of the week for today presence')
          } else {
          }
        }
      }
    } else {
//      var weekRecordRange = weekSheet.getRange(3,2,16,1)
//      weekRecordRange.setValue('not even working')
//      console.log('not even working');
    }
  }
}