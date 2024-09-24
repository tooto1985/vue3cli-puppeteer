const setTitle = (value) => {
    document.title = value;
};

const addMeta = (property, key, value) => {
    var meta = document.createElement('meta');
    meta[property] = key;
    meta.content = value;
    document.getElementsByTagName('head')[0].appendChild(meta);
};
export { setTitle, addMeta };