
const MoveShooter = (entities, { touches }) => {

    touches.filter(t => t.type === "move").forEach(touch => {
        let shooter = entities[2];
        if (shooter && shooter.position) {
            shooter.position = [
                shooter.position[0] + touch.delta.pageX,
                shooter.position[1]
            ];
        }
    });

    return entities;
}


export { MoveShooter };