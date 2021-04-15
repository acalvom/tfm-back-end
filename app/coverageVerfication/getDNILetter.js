function getDNILetter(number) {
    if (typeof (number) != 'number')
        return "error";
    else {
        let letters = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'],
            mod = number % 23;
        return letters[mod];
    }
}

exports.getDNILetter = getDNILetter;
