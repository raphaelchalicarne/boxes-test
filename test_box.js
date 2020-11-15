function rec(clawPos, boxes, boxInClaw, ideal_nb_box_per_pos, instructions) {
    var boxes_correctly_placed = are_boxes_correctly_placed(boxes, ideal_nb_box_per_pos);
    if (!boxes_correctly_placed || boxInClaw) {
        // Actions
        if (boxInClaw) {
            var pos_min_boxes = minIndex(boxes);
            if (boxes[clawPos] == boxes[pos_min_boxes]) {
                // Place a box
                instructions += '|PLACE';
                boxInClaw = false;
                boxes[clawPos] += 1;
            } else {
                // Move to place a box
                var direction = pos_min_boxes < clawPos ? '|LEFT' : '|RIGHT';
                clawPos = pos_min_boxes < clawPos ? clawPos - 1 : clawPos + 1;
                instructions += direction;
            }
        } else { //No box in claw
            var pos_max_boxes = maxIndex(boxes);
            if (boxes[clawPos] == boxes[pos_max_boxes]) {
                // Pick a box
                instructions += '|PICK';
                boxInClaw = true;
                boxes[clawPos] -= 1;
            } else {
                // Move to pick a box
                var direction = pos_max_boxes < clawPos ? '|LEFT' : '|RIGHT';
                clawPos = pos_max_boxes < clawPos ? clawPos - 1 : clawPos + 1;
                instructions += direction;
            }
        }
        instructions = rec(clawPos, boxes, boxInClaw, ideal_nb_box_per_pos, instructions);
    }
    return instructions;
}

function are_boxes_correctly_placed(boxes, ideal_nb_box_per_pos) {
    var boxes_correctly_placed = boxes.reduce((box_correctly_placed, nb_box_in_cell) => ((nb_box_in_cell < ideal_nb_box_per_pos) || (nb_box_in_cell > ideal_nb_box_per_pos + 1)) ? box_correctly_placed && false : box_correctly_placed && true, true);
    return boxes_correctly_placed;
}

function maxIndex(array) {
    return array.reduce((i_max, nb_box_in_cell, i, arr) => nb_box_in_cell > arr[i_max] ? i : i_max, 0);
}

function minIndex(array) {
    return array.reduce((i_min, nb_box_in_cell, i, arr) => nb_box_in_cell < arr[i_min] ? i : i_min, 0);
}

function solve(clawPos, boxes, boxInClaw) {
    // Write your code here
    // To debug: console.error('Debug messages...');

    // Initialisation
    var sum_boxes = boxes.reduce((somme, nb_box_in_cell) => somme + nb_box_in_cell);
    sum_boxes = boxInClaw ? sum_boxes + 1 : sum_boxes;
    var ideal_nb_box_per_pos = Math.trunc(sum_boxes/boxes.length);
    var instructions = '';
    instructions = rec(clawPos, boxes, boxInClaw, ideal_nb_box_per_pos, instructions);
    instructions = instructions.slice(1);
    return instructions;
}

/* Ignore and do not change the code below */
// #region main

// game loop
while (true) {
    const clawPos = parseInt(readline());
    const boxInClaw = readline() !== '0';
    const stacks = parseInt(readline());
    const boxes = readline().split(' ').map(j => parseInt(j)).slice(0, stacks);
    const oldWrite = process.stdout.write;
    process.stdout.write = chunk => console.error(chunk);
    var action = solve(clawPos, boxes, boxInClaw);
    process.stdout.write = oldWrite;
    console.log(action);
}
// #endregion

