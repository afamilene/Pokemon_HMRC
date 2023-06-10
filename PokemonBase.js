const cnstPokeMon_Names = 'https://pokeapi.co/api/v2/pokemon';
const cnstPokeMon_Species = 'https://pokeapi.co/api/v2/pokemon-species';
const cnstGetPokeMonNames = 1; // Get pokemon names
const cnstGetPokeMonSpecies = 2; // Get pokemon names
var PokenmonNamelist = null;
var PokenmonSpecieslist = null;
var strEvolutionChain = "";
var vrVariationCounter = 0;

function FetchPokenmonNames()
{
    PokeMonResourceGet(cnstPokeMon_Names, null, cnstGetPokeMonNames, PokeMonResourceGetResult);
}

function FetchPokenmonSpecies()
{
    PokeMonResourceGet(cnstPokeMon_Species, null, cnstGetPokeMonSpecies, PokeMonResourceGetResult);
}

function PokeMonResourceGet(Getparam, FuncParam, FuncCallerIndicator, CallResultFunc)
{ 
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() 
  {
    switch (this.readyState) 
    {
      case 4:
        if(this.status === 200)
        {
            CallResultFunc(FuncCallerIndicator, FuncParam, this.responseText);
        }
        else if(this.status === 403)
        {
            CallResultFunc(FuncCallerIndicator, FuncParam, null);
        }
        else if(this.status === 404)
        {
            CallResultFunc(FuncCallerIndicator, FuncParam, null);
        }
        break;
      case 0:
        {
            CallResultFunc(FuncCallerIndicator, FuncParam, null);
        }
        break;
      default:
        {
            CallResultFunc(FuncCallerIndicator, FuncParam, null);
        }
    }

  }
  
  xmlhttp.open("GET", Getparam, true);

  xmlhttp.send();
}

function PokeMonResourceGetResult(CallerIndicator, Objct, strResult)
{
    if(strResult !== null)
    {
        switch (CallerIndicator) 
        {
            case cnstGetPokeMonNames:
            SetPokemonNames(strResult);
            break;
            case cnstGetPokeMonSpecies:
            SetPokemonSpecies(strResult);
            PopulatePokemonNameUIcntrl();
            break;
        } 
        
        return true;
    }
    else
    {
       return false;
    }
    
}

function SetPokemonNames(strNameJSONstr)
{
   PokenmonNamelist = JSON.parse(strNameJSONstr); 
}

function SetPokemonSpecies(strNameJSONstr)
{
   PokenmonSpecieslist = JSON.parse(strNameJSONstr); 
}

function FindPokemonSpecieEvolotionHistory(strPokemonName)
{
    if(PokenmonNamelist !== null && PokenmonSpecieslist !== null)
    {
        for (let count = 0; count < PokenmonNamelist.results.length; count++) 
        {
            let PokemonNameObjct = PokenmonNamelist.results[count];
            if(PokemonNameObjct.name === strPokemonName)
            {
                // create evolution chain for the name
                //alert(PokemonNameObjct.name);
                strEvolutionChain = '{';
                AddnameToSpecieChain(strPokemonName);
                FindPokemonSpecie(strPokemonName, PokenmonSpecieslist);
                InsertClosingBraces();
                strEvolutionChain += '}';
                break;
            }
        }      
    }
}

function FindPokemonSpecie(strPokeMonName, SpecieListObj)
{
    for (let count = 0; count < SpecieListObj.results.length; count++) 
    {
        let SpecieNameObj = SpecieListObj.results[count];
        if(SpecieNameObj.name === strPokeMonName)
        {
            if((count + 1) < SpecieListObj.results.length)
            {
                ++vrVariationCounter;
                //alert("count up");
                let EvolvedSpecieObj = SpecieListObj.results[(count + 1)];
                AddSpecieVariationToSpecieChain(EvolvedSpecieObj.name);
            }
            else
            {
                AddSpecieVariationToSpecieChain(null);
            }
        }
    }      
}

function AddnameToSpecieChain(strName)
{
    strEvolutionChain += '“name”:';
    strEvolutionChain += strName;
    //alert(strEvolutionChain);
    //“name”: “caterpie”,  
}

function AddSpecieVariationToSpecieChain(strSpecieVariationName)
{
    if(strSpecieVariationName !== null)
    {
        strEvolutionChain += ',';
        strEvolutionChain += '“variations”:[{“name”:';
        strEvolutionChain += strSpecieVariationName;
        
        // find this variation evolution line
        FindPokemonSpecie(strSpecieVariationName, PokenmonSpecieslist);
        //alert(strEvolutionChain);
    }
    else
    {
        strEvolutionChain += ',';
        strEvolutionChain += '“variations”:[]';  
        //strEvolutionChain += '}]'; 
    }
    //“name”: “caterpie”,  
}

function PopulatePokemonNameUIcntrl()
{ 
    if(PokenmonNamelist !== null && PokenmonSpecieslist !== null)
    {
        for (let count = 0; count < PokenmonNamelist.results.length; count++) 
        {
            let ltPokemonNameObjct = PokenmonNamelist.results[count];
            AddPokemonNameToSelectCntrl(ltPokemonNameObjct.name);
        }      
    }
    else
    {
        alert("Unable to acquire pokemon data from remote source");
    }
  
}

function AcquireRemotePokemonData()
{
    FetchPokenmonNames();
    FetchPokenmonSpecies();   
}

function EvolutionHistoryResult()
{
    //alert(strEvolutionChain);
    var x = document.getElementById(cnstEvolutionDisplayCntr_ID).innerHTML = strEvolutionChain;
}

function FindPokemonEvolutionChain()
{
    vrVariationCounter = 0;
    var x = document.getElementById(cnstPokemonNameSlctCntr_ID).selectedIndex;
    var y = document.getElementById(cnstPokemonNameSlctCntr_ID).options;
    //alert("Index: " + y[x].index + " is " + y[x].text);    
    
    FindPokemonSpecieEvolotionHistory(y[x].text);
    EvolutionHistoryResult();
}

function InsertClosingBraces()
{
    for(let count = 0; count < vrVariationCounter; count++)
    {
        strEvolutionChain += '}]'; 
    }
}