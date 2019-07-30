module.exports = (temp, el) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, el.productName);
    output = output.replace(/{%IMAGE%}/g, el.image);
    output = output.replace(/{%ORIGIN%}/g, el.from);
    output = output.replace(/{%NUTRIENTS%}/g, el.nutrients);
    output = output.replace(/{%QUANTITY%}/g, el.quantity);
    output = output.replace(/{%PRICE%}/g, el.price);
    output = output.replace(/{%DESCRIPTION%}/g, el.description);
    if (el.organic !== true) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
};