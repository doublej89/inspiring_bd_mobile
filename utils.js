export function strim(string) {
    return string.replace(/((<br\/>)|\s|(<br>))*$/gm, "");
}

export function cleanHtml(dirty) {
    const regex = /(<([^>]+)>)/gi;
    let _cleanDescription = dirty.replace(regex, "");

    return _cleanDescription;
}
