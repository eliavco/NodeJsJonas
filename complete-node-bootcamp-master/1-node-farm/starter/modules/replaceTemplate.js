module.exports = (temp, el) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, el.productName);
    output = output.replace(/{%ID%}/g, el.id);
    output = output.replace(/{%IMAGE%}/g, el.image);
    output = output.replace(/{%QUANTITY%}/g, el.quantity);
    output = output.replace(/{%PRICE%}/g, el.price);
    if (el.organic !== true) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
};