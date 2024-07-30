export function splitName(name: string) {

    // Remove multiple spaces
    name = name.trim();
    while (name.indexOf('  ') >= 0) {
        name = name.replace('  ', ' ');
    }

    // Split in parts
    let space = name.indexOf(' ');
    if (space === -1) {
        return { first: name, last: null };
    }

    let first = name.substring(0, space).trim();
    let last = name.substring(space + 1).trim();
    return { first, last };
}