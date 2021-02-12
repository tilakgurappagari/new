import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';



export const addIngredient = (name) => {

    return{
        ingredientName : name,
        type : actionTypes.ADD_INGREDIENT
    };
};

export const removeIngredient = (name) => {

    return{
        ingredientName : name,
        type : actionTypes.REMOVE_INGREDIENT
};
};

export const setIngredients = (ingredients) => {
    return {
                type : actionTypes.SET_INGREDIENTS,
                ingredients : ingredients
    };
};

export const fetchIngredientsFailed = () =>{
    return{
        type : actionTypes.FETCH_INGREDIENTS_FAILED
    }
}

export const initIngredients = () =>{

    return (dispatch) => {
         axios.get( 'https://burger-builder-e8150-default-rtdb.firebaseio.com/ingredients.json' )
            .then( response => {
                // this.setState( { ingredients: response.data } );
                dispatch(setIngredients(response.data));
            } )
            .catch( error => {
                // this.setState( { error: true } );
                dispatch(fetchIngredientsFailed());
            } );
    };
};
