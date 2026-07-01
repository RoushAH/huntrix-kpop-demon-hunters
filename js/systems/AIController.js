export class AIController {
  constructor(entity) {
    this.entity = entity;
    this.state = 'follow';
    this.target = null;
    this.attackRange = 50;
    this.followDistance = 80;
    this.engageDistance = 600;
  }

  update(dt, enemies) {
    const nearestEnemy = this.findNearestEnemy(enemies);

    if (nearestEnemy) {
      const distance = this.entity.position.distanceTo(nearestEnemy.position);

      if (distance < this.attackRange) {
        this.state = 'attack';
        this.entity.velocity.x = 0;
        this.entity.velocity.y = 0;

        if (this.entity.attackCooldown <= 0 && !this.entity.isAttacking) {
          this.entity.attack();
        }
      } else if (distance < this.engageDistance) {
        this.state = 'engage';
        const direction = nearestEnemy.position.clone().subtract(this.entity.position).normalize();
        this.entity.velocity = direction.multiply(this.entity.baseSpeed);
      } else {
        this.state = 'idle';
        this.entity.velocity.x = 0;
        this.entity.velocity.y = 0;
      }
    } else {
      this.state = 'idle';
      this.entity.velocity.x = 0;
      this.entity.velocity.y = 0;
    }
  }

  findNearestEnemy(enemies) {
    let nearest = null;
    let minDistance = Infinity;

    enemies.forEach(enemy => {
      if (!enemy.active) return;
      const distance = this.entity.position.distanceTo(enemy.position);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = enemy;
      }
    });

    return nearest;
  }
}
