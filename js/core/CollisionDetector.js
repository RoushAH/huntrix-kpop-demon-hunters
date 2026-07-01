export class CollisionDetector {
  static checkAABB(entityA, entityB, leeway = 0) {
    const a = entityA.getBounds ? entityA.getBounds() : entityA;
    const b = entityB.getBounds ? entityB.getBounds() : entityB;

    return (
      a.x < b.x + b.width + leeway &&
      a.x + a.width + leeway > b.x &&
      a.y < b.y + b.height + leeway &&
      a.y + a.height + leeway > b.y
    );
  }

  static resolveCollision(entityA, entityB) {
    const a = entityA.getBounds();
    const b = entityB.getBounds();

    const overlapX = Math.min(
      a.x + a.width - b.x,
      b.x + b.width - a.x
    );
    const overlapY = Math.min(
      a.y + a.height - b.y,
      b.y + b.height - a.y
    );

    if (overlapX < overlapY) {
      if (a.x < b.x) {
        entityA.position.x -= overlapX / 2;
        entityB.position.x += overlapX / 2;
      } else {
        entityA.position.x += overlapX / 2;
        entityB.position.x -= overlapX / 2;
      }
    } else {
      if (a.y < b.y) {
        entityA.position.y -= overlapY / 2;
        entityB.position.y += overlapY / 2;
      } else {
        entityA.position.y += overlapY / 2;
        entityB.position.y -= overlapY / 2;
      }
    }
  }
}
