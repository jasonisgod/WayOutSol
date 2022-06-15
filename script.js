
function getDim(map) {
    var row = map.length;
    var col = map[0].length;
    return { row, col };
}

function printMap(map) {
    var s = "";
    let { row, col } = getDim(map);
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            s += map[i][j].toString();
        }
        s += '\n';
    }
    console.log(s);
}

function inputText() {
    var map = $("#input").val().split('\n');
    let { row, col } = getDim(map);
    for (var i = 0; i < row; i++) {
        map[i] = map[i].split('');
        for (var j = 0; j < col; j++) {
            map[i][j] = (map[i][j] == '0' ? 0 : 1);
        }
    }
    return map;
}

function createMap(row, col) {
    return [...Array(row)].map(e => Array(col).fill(0));
}

function copyMap(map) {
    let { row, col } = getDim(map);
    var copy = createMap(row, col);
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            copy[i][j] = map[i][j];
        }
    }
    return copy
}

function pressMap(map, ii, jj) {
    var d = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];
    let { row, col } = getDim(map);
    for (var k = 0; k < d.length; k++) {
        var i = ii + d[k][0];
        var j = jj + d[k][1];
        if (0 <= i && i < row && 0 <= j && j < col) {
            map[i][j] = 1 - map[i][j];
        }
    }
}

function chaseMap(map) {
    let { row, col } = getDim(map);
    var sol = createMap(row, col);
    for (var i = 0; i < row - 1; i++) {
        for (var j = 0; j < col; j++) {
            if (map[i][j] == 1) {
                pressMap(map, i + 1, j);
                sol[i + 1][j] = 1;
            }
        }
    }
    return sol;
}

function getMatrix(row, col) {
    var mtx = createMap(col, col);
    for (var i = 0; i < col; i++) {
        var map = createMap(row, col);
        pressMap(map, 0, i);
        _ = chaseMap(map);
        for (var j = 0; j < col; j++) {
            mtx[i][j] = map[row-1][j];
        }
    }
    return mtx;
}

function getBinList(num, k) {
    var arr = Array(k);
    for (var i = 0; i < k; i++) {
        arr[i] = num % 2;
        num = Math.floor(num / 2);
    }
    return arr;
}

function mulVecVec(vec1, vec2) {
    var ans = 0;
    var n = vec1.length;
    for (var i = 0; i < n; i++) {
        ans += vec1[i] * vec2[i];
    }
    return ans;
}

function mulMatVec(mat, vec) {
    var n = mat.length;
    var ans = Array(n);
    for (var i = 0; i < n; i++) {
        ans[i] = mulVecVec(mat[i], vec);
        ans[i] %= 2;
    }
    return ans;
}

function equalVec(vec1, vec2) {
    var n = vec1.length;
    for (var i = 0; i < n; i++) {
        if (vec1[i] != vec2[i]) {
            return false;
        }
    }
    return true;
}

function solveEq(a, b) {
    let {row, col} = getDim(a);
    var n = Math.pow(2, col);
    for (var i = 0; i < n; i++) {
        var x = getBinList(i, col);
        var ax = mulMatVec(a, x);
        if (!equalVec(ax, b)) {
            continue;
        }
        return x;
    }
    return null;
}

function getSol(map, x) {
    x.forEach((e, i) => e == 1? pressMap(map, 0, i): null);
    sol = chaseMap(map);
    x.forEach((e, i) => sol[0][i] = e);
    return sol
}

function outputText(text) {
    $("#output").val(text);
}

function solve() {
    try {
        let map = inputText();
        let {row, col} = getDim(map);
        tmp = copyMap(map);
        _ = chaseMap(tmp);
        a = getMatrix(row, col);
        b = tmp[row-1];
        x = solveEq(a, b);
        sol = getSol(map, x);
        text = sol.join('\n').replace(/,/g, '');
        outputText(text);
    } 
    catch (error) {
        outputText("error");
    }
}
