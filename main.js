
var board =[[null, null, null],  //the matrix representing the tic-tac-toe board
            [null, null, null],
            [null, null, null]];
        
var boardWidth = 3,
    fillLimit = boardWidth*boardWidth;
    fillCount = 0, //counts the number of filled cells in the matrix
    whoseTurn = undefined,  //whether human or computer
    human = 1, computer = 0, //keeps track of whose turn. whoseTurn = human||computer
    humanSymbol = 'O', computerSymbol = 'X', 
    winner = undefined,  //draw, human or computer
    cellToDefend=undefined;
    
    
    
/******************************************************************************
 * This function is very efficient. It does not search the entire matrix for a 
 * win. It searches only the relevant row and column, and the diagonals if the 
 * indices fall on the diagonals. 
 * @param {Integer} fillCount : whose turn - computerSymbol or humanSymbol
 * @param {integer} row : the row index of the move just made
 * @param {inter} col  : the row index of the move just made
 * @returns {Array|String}
 ******************************************************************************/    

function calcWin(row, col, fillCount)
{       
    var win = true, //just a precondition
        winArray=[], blankCell;        

    if ((calcWin.caller.caller ==playHuman)&&(fillLimit>9)) //if this function is called by playHuman
    {
        blankCell=[];  //change blankCell from undefined to null array ie defined.
        console.log('It is working..',calcWin.caller.caller.name);
    }
    
    for (var i = 0; i<boardWidth; i++)
    {
        if (board[row][col]===board[row][i]) //search the row for equality
        {
            winArray.push([row, i]);
        }
        else
        {
            win = false;
            if (!blankCell)
              break;
            blankCell=[row,i];
        }   
    }
    
    if (win===true) 
        return winArray;
    
    if ((blankCell)&&(winArray.length===(boardWidth-1)))
        cellToDefend=blankCell;
    winArray=[];
    
    win = true; //just a precondition
    for (var j = 0; j<boardWidth; j++)
    {
        if (board[row][col]===board[j][col]) //search the column for equality
        {   
            winArray.push([j, col]);
        }
        else
        {
            win = false;
            if (!blankCell)
              break;
            blankCell=[j,col];
        }
    }
    
    if (win===true) 
        return winArray;
    
    if ((blankCell)&&(winArray.length===(boardWidth-1)))
        cellToDefend=blankCell;
    winArray=[];    
    
    win = true;
    
    if (row === col)
    {
      for (var k = 0; k<boardWidth; k++)
      {
        if (board[row][col]===board[k][k]) //search the main diagonal for equality
        {   
            winArray.push([k, k]);
        }
        else
        {
            win = false;
            if (!blankCell)
              break;
            blankCell=[k,k];
        }
      }
    
       if (win===true) 
           return winArray;
       
       if ((blankCell)&&(winArray.length===(boardWidth-1)))
          cellToDefend=blankCell;
       winArray=[];
    }    
        
    win = true;
    
    if ((row+col)===(boardWidth-1))
    {
        for (var m = 0; m<boardWidth; m++)
        {
            if (board[row][col]===board[(boardWidth - 1 - m)][m]) //search the off diagonal for equality
            {   
                winArray.push([(boardWidth - 1 - m), m]);
            }
            else
            {
                win = false;
                if (!blankCell)
                   break;
                blankCell=[(boardWidth - 1 - m), m];
            }
        }
        if (win===true) 
            return winArray;
        
        if ((blankCell)&&(winArray.length===(boardWidth-1)))
            cellToDefend=blankCell;
           
        winArray=[];
    }
        
    if ( fillCount === fillLimit)
        return 'draw';
    else
        return 'continue'; //game not done
}



/*******************************************************************************
 * This function searches the matrix for an empty cell and returns it if found
 * @returns {Array} An array with the row and col indices of the empty cell
 *******************************************************************************/
function findEmptyCells()
{ 
   var arr=[];
   for (var i = 0; i<boardWidth; i++)
        for (var j =0; j<boardWidth; j++)
            if (board[i][j]===null)
                arr.push([i,j]);
   return arr; 
}
/*******************************************************************************
 * This function calculates the optimal move for computerSymbol or humanSymbol 
 * @param {Integer} fillCount
 * @param {Char} who : computerSymbol or humanSymbol 
 * @returns {Array} An array with the optimal position and its rank value 
 *   in the form [[i,j],val]
 ******************************************************************************/
function calcMove(who, fillCount)
{   
    var moveArray = [],
        max = [[-1, -1],-1000], //assume a max of -1000
        min = [[-1, -1],1000];  //assume a min of 1000
 
    for (var i = 0; i<boardWidth; i++)
        for (var j =0; j<boardWidth; j++)
            if (board[i][j]===null) //if that cell of the matrix is null, call minMax on it
                moveArray.push([[i,j],minMax(who, i, j, fillCount)]); //push an item of type [[i,j], val]
            
    
   if (who === computerSymbol)  //if player is computerSymbol
    {
        for (var k = 0; k<moveArray.length; k++)  //find the max
        {    
            if (moveArray[k][1] > max[1])
                max = moveArray[k];
            else //make the application more dynamic by choosing randomly a max value for the array that is equal to the current max value
                if (moveArray[k][1] === max[1])
                {
                  var rand = ~~(Math.random()*2);
                  if (rand === 1)
                      max = moveArray[k];
                }
        }
        return max;
    }
    else //if player is '0'
    {
        for (var k = 0; k<moveArray.length; k++)  ///find the min
        {
            if (moveArray[k][1] < min[1])
                min = moveArray[k];
            else //make the application more dynamic by choosing randomly a min value for the array that is equal to the current min value
                if (moveArray[k][1] === min[1])
                {
                  var rand = ~~(Math.random()*2);
                  if (rand === 1)
                      min = moveArray[k];
                }
        }
        return min;    
    } 
}

/*******************************************************************************
 * This is the function that calculates the rank value of the cell indicated by
 *   the indices [row, col].
 * @param {Integer} fillCount
 * @param {char} who
 * @param {integer} row
 * @param {integer} col
 * @returns {integer}
 ******************************************************************************/
function minMax(who, row, col, fillCount)//instead of who, use n as a count and use odd and even to determine whose turn
{  
    var returnVal,  //the rank value of the move to be returned 
        move;       //the move position [[i,j], val] returned by calcMove()
        
    board[row][col]= who;
    
    var val = calcWin(row, col, fillCount+1); //whether 'draw', 'win' or 'continue'
    
      if (val === 'draw')
          returnVal = 0;
      
      else if (val==='continue')
      {     
            if (who === computerSymbol)
                who = humanSymbol;
            else 
                who = computerSymbol;
            
            move = calcMove(who, fillCount+1); // returns something of type [[i,j], val]
            returnVal = move[1];
       }
      else //someone has won
      {
            if (who === computerSymbol)
                returnVal = 10;
            else 
                returnVal = -10;            
      }   
       
      board[row][col]=null; //reset the board to what it was before minMax call since that's not the real state of the board
      return returnVal;
}

/*******************************************************************************
 * This function is called when the player clicks on a square on the tic-tac-toe.
 * @param {html} element ... The [this] value of the calling element
 * @param {integer} row
 * @param {integer} col
 * @returns {nothing}
 ******************************************************************************/
function playHuman(element, row, col) //called when the human is to play
{
    if ((whoseTurn === human)&&(board[row][col]===null)&&(winner===undefined)) //if it's the human's turn and if the chosen cell is available
    {
        playSound(sound2);
        //console.log('........human play['+row+','+col+']');
        board[row][col]=humanSymbol;  //insert humanSymbol in the board at position [row, col]
        element.children[0].innerHTML = humanSymbol; //display the humanSymbol on the board
        fillCount++;   //increment the counter of the number of cells filled 
        document.getElementById('fills').innerHTML--;
        if (fillCount >= (boardWidth*2 - 3)) //only check for a winner if there have been 5 or more plays
          isWinner(humanSymbol, row, col);  //set winner status
        if (winner===undefined)
        {
          whoseTurn = computer; //it's now the computer's turn
          setTimeout(playComputer, 1000, board);
        } 
    }
    else if (whoseTurn === computer)
        alert('Please wait or choose a symbol..');
    else if (board[row][col]!==null)
        alert('Someone already played there..');  
    else
        alert('Wait for the game or choose new preference..');
}

/*******************************************************************************
 * This function is called by playHuman() so as to alternate play between human
 *    and computer.
 * @returns {nothing}
 ******************************************************************************/
function playComputer()
{
  var row, col; 
  playSound(sound1);      
  if (((fillLimit - fillCount)< 9)&&(fillCount < fillLimit))//do minMax
  {
      document.getElementById('mode').innerHTML='MiniMax';
     var move = calcMove(computerSymbol, fillCount); //move = [[i,j], val] where val is the highest minmax value chosen
        row = move[0][0];
        col = move[0][1];   
  } 
  else if (cellToDefend!==undefined)
  {
      document.getElementById('mode').innerHTML='Defense';
      row = cellToDefend[0];
      col = cellToDefend[1];
      cellToDefend=undefined;
  }
  else //do not do minMax. Choose randomly instead
  {
      document.getElementById('mode').innerHTML='Random';
      var arr = findEmptyCells();
      var randCell = arr[~~(Math.random()*arr.length)]; //floor of random. Note" ~~ = Math.floor()
      row =  randCell[0];
      col = randCell[1];
  }     
  board[row][col]=computerSymbol;
  document.getElementById('elem'+row+col).children[0].innerHTML =computerSymbol; //print the x on the board
  fillCount++;   //increment the count of the filled cells
  document.getElementById('fills').innerHTML--;
  if ( fillCount >= (boardWidth*2 - 1) )  //only check for a winner if there are 5 or more plays 
    isWinner(computerSymbol, row, col);   //this will set the winner status
  if (winner===undefined)  //if there is no winner
        whoseTurn = human;
}

/*******************************************************************************
 * This function is called by playComputer() and playHuman() after there are 5
 *   or more plays.
 * @param {char} who
 * @param {integer} row
 * @param {integer} col
 * @returns {nothing. It simply sets the winner status after calling calcWin()}
 ******************************************************************************/
function isWinner(who, row, col)
{
    var winStatus = calcWin(row, col, fillCount);
    console.log('This is the winSatus after play by "'+who+'" '+winStatus);
    if (winStatus === 'draw')
    {
      winner = 'draw';  //set winner to 'draw'
      document.getElementById('draws').innerHTML++;
      playSound(sound3);
      waitForUser();
    }
    else if (winStatus !== 'continue')
    {
      winner = who;   //set winner to humanSymbol or computerSymbol
      for (var i = 0; i<winStatus.length; i++)
        document.getElementById('elem'+winStatus[i][0]+winStatus[i][1]).children[0].classList.add("winner");
      
      if (who===humanSymbol)
          document.getElementById('human').innerHTML++;
      else
          document.getElementById('computer').innerHTML++;
      playSound(sound3);
      waitForUser();
    }
    else; //do nothing as the game continues;
}

/******************************************************************************
 * This function is called when the game loads or atbthe end of the game.
 * @returns {nothing}
 */
function controlGame()
{
    var E;
    board = [];
    for (var a = 0; a<boardWidth; a++)
    {
      board.push([]); //increase dimension of board
      for (var b= 0; b<boardWidth; b++)
      {  
          board[a][b]=null;
          E = document.getElementById('elem'+a+b).children[0];
          E.innerHTML='';
          E.classList.remove('winner');
      }
    }
    
    fillLimit = boardWidth*boardWidth;
    whoseTurn = undefined;  //whether human or computer
    winner = undefined;
    cellToDefend=undefined;
    fillCount = 0; //counts the number of filled cells in the matrix
    document.getElementById('fills').innerHTML=fillLimit;
    document.getElementById('mode').innerHTML='Random';
        
    var count = ~~(Math.random()*2); //floor
    
    if (count===0)
    {
        whoseTurn = computer;
        alert('The computer has been randomly chosen to move first!');
        playComputer(board);
    }
    else
    {
         whoseTurn = human; 
         alert('You have been randomly chosen to move first!');
    }
}

var timeoutHandle;

function waitForUser()
{
    timeoutHandle = setTimeout(controlGame, 1000);
}

function setUserPreference(preference)
{
    
        
        if (preference === 'X')
        {
            humanSymbol = 'X';
            computerSymbol = 'O';
        }
        else
        {
            humanSymbol = 'O';
            computerSymbol = 'X';
        }
        document.getElementById('humanSymbol').innerHTML=humanSymbol;
        document.getElementById('computerSymbol').innerHTML=computerSymbol;
        
        
    if (fillCount===0)
    {
        clearTimeout(timeoutHandle);
        controlGame();   
    }
    else
    {
        var E;
        for (var i = 0; i<boardWidth; i++ )
            for (var j = 0; j<boardWidth; j++ )
            {  
                E = document.getElementById('elem'+i+j).children[0];
                
                if (board[i][j] === humanSymbol)
                {
                    E.innerHTML = computerSymbol;
                    board[i][j] = computerSymbol;
                }
                else if (board[i][j] === computerSymbol)
                {
                    E.innerHTML = humanSymbol;
                    board[i][j] = humanSymbol;                    
                }
                else; //it's null at this point
                    
            }
    }
}

var sound1, sound2, sound3;

function playSound(sound)
  {
    
     sound.muted=false;
     sound.paused=false;
     sound.ended = false;
     sound.async = true;
     sound.volume = 1;
     if ((sound.error !== null)&&(sound.error !== 4))
     {
         sound.load();
     }
     sound.play();
 }
 
 function generateNewBoard(bWidth)
 {
     var str = '',
         secondClass = '';
     boardWidth = bWidth;
     fillLimit = boardWidth*boardWidth;
     
   for (var i =0; i<boardWidth; i++)
       for (var j =0; j<boardWidth; j++)
       {
           if ((i===0)&&(j===0))
              secondClass='topLeft';
           else if ( (i===0) && (j===(boardWidth-1) ))
              secondClass='topRight';
           else if ( (i===(boardWidth-1)) && (j===0 ))
              secondClass='bottomLeft';
           else if ( (i===(boardWidth-1)) && (j===(boardWidth-1) ))
              secondClass='bottomRight';
           else
               secondClass='';

              
           str +='<div class="button '+secondClass+'" id = "elem'+i+j+
                 '" onclick="playHuman(this,'+i+','+j+')"><span></span></div>';
        }
        
         var E = document.getElementById('board');
         E.innerHTML = str;
         E.style.width=boardWidth*103.33+'px';
         E.style.height=boardWidth*103.33+'px';
     document.getElementById('gameFace').style.width=(boardWidth*103.33+190)+'px';
     document.getElementById('userInfo').style.width=(boardWidth*100.63)+'px';
     //document.getElementById('para').style.width= (boardWidth*50.665 - 60)+'px';
     waitForUser();
 }