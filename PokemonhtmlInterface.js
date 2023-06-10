const cnstPokemonNameSlctCntr_ID = "PokeMon_NameList_ID";
const cnstEvolutionDisplayCntr_ID = "EvolutionChainEntry_ID";

function AddPokemonNameToSelectCntrl(strPokemonName)
{
    var x = document.getElementById(cnstPokemonNameSlctCntr_ID);
    var option = document.createElement("option");
    option.text = strPokemonName;
    x.add(option);    
}