export class AIController {
  constructor(entity, player, companions) {
    this.entity = entity;
    this.player = player;
    this.companions = companions;
    this.state = 'follow';
    this.target = null;
    this.followDistance = 80;
    this.engageDistance = 600;
    this.assignedZone = null; // 'top', 'bottom', or null for ranged
  }

  get attackRange() {
    return this.entity.attackRange; // Use entity's actual attack range
  }

  update(dt, enemies) {
    // Determine zone assignment based on character type and player position
    this.updateZoneAssignment();

    // Find the best enemy to target based on zone strategy
    const targetEnemy = this.findZoneTarget(enemies);
    this.target = targetEnemy; // Track current target for companion coordination

    if (targetEnemy) {
      const distance = this.entity.position.distanceTo(targetEnemy.position);

      // Ranged character (Mira) keeps distance
      if (this.entity.attackRange > 100) {
        this.handleRangedBehavior(targetEnemy, distance);
      } else {
        this.handleMeleeBehavior(targetEnemy, distance);
      }
    } else {
      // No enemies, move to zone position
      this.target = null;
      this.moveToZonePosition();
    }
  }

  updateZoneAssignment() {
    // Mira (ranged) doesn't need a zone
    if (this.entity.attackRange > 100) {
      this.assignedZone = null;
      return;
    }

    // For melee companions, determine who gets top and who gets bottom
    const meleeCompanions = this.companions.filter(c => c.attackRange <= 100);
    const companionIndex = meleeCompanions.indexOf(this.entity);

    if (companionIndex === -1) return;

    // Check if player is melee
    const playerIsMelee = this.player.attackRange <= 100;

    if (playerIsMelee) {
      // Player is melee, so avoid their zone
      const playerInTopHalf = this.player.position.y < 225;

      if (meleeCompanions.length === 1) {
        // Only one melee companion, take opposite zone from player
        this.assignedZone = playerInTopHalf ? 'bottom' : 'top';
      } else {
        // Two melee companions, first takes opposite of player, second takes player's zone
        if (companionIndex === 0) {
          this.assignedZone = playerInTopHalf ? 'bottom' : 'top';
        } else {
          this.assignedZone = playerInTopHalf ? 'top' : 'bottom';
        }
      }
    } else {
      // Player is ranged (Mira), companions split top/bottom
      this.assignedZone = companionIndex === 0 ? 'top' : 'bottom';
    }
  }

  handleRangedBehavior(targetEnemy, distance) {
    const optimalDistance = 200; // Mira wants to stay ~200px away (closer to action)

    // Much more aggressive - attack as soon as in range
    if (distance < this.attackRange && this.entity.attackCooldown <= 0 && !this.entity.isAttacking) {
      // In range, attack
      this.state = 'attack';
      this.entity.velocity.x = 0;
      this.entity.velocity.y = 0;
      this.entity.attack();
    } else if (distance < optimalDistance * 0.5) {
      // Too close, back away (< 100px)
      this.state = 'retreat';
      const awayDirection = this.entity.position.clone().subtract(targetEnemy.position).normalize();
      this.entity.velocity = awayDirection.multiply(this.entity.baseSpeed * 0.8);
    } else if (distance > optimalDistance) {
      // Too far, move closer more aggressively
      this.state = 'position';
      const direction = targetEnemy.position.clone().subtract(this.entity.position).normalize();
      this.entity.velocity = direction.multiply(this.entity.baseSpeed * 0.7); // Was 0.5, now 0.7
    } else {
      // In sweet spot (100-200px), hold position and keep attacking
      this.state = 'hold';
      this.entity.velocity.x = 0;
      this.entity.velocity.y = 0;
    }
  }

  handleMeleeBehavior(targetEnemy, distance) {
    if (distance < this.attackRange) {
      // In melee range, attack
      this.state = 'attack';
      this.entity.velocity.x = 0;
      this.entity.velocity.y = 0;

      if (this.entity.attackCooldown <= 0 && !this.entity.isAttacking) {
        this.entity.attack();
      }
    } else if (distance < this.engageDistance) {
      // Chase enemy
      this.state = 'engage';
      const direction = targetEnemy.position.clone().subtract(this.entity.position).normalize();
      this.entity.velocity = direction.multiply(this.entity.baseSpeed);
    } else {
      this.moveToZonePosition();
    }
  }

  moveToZonePosition() {
    // Move to center of assigned zone
    this.state = 'position';

    if (!this.assignedZone) {
      // Ranged character, position more aggressively forward
      const targetX = 200; // Was 150, now 200
      const targetY = 225;
      this.moveTowards(targetX, targetY);
    } else {
      const targetX = 300;
      const targetY = this.assignedZone === 'top' ? 150 : 300;
      this.moveTowards(targetX, targetY);
    }
  }

  moveTowards(targetX, targetY) {
    const dx = targetX - this.entity.position.x;
    const dy = targetY - this.entity.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 20) {
      this.entity.velocity.x = 0;
      this.entity.velocity.y = 0;
    } else {
      const dirX = dx / distance;
      const dirY = dy / distance;
      this.entity.velocity.x = dirX * this.entity.baseSpeed * 0.5;
      this.entity.velocity.y = dirY * this.entity.baseSpeed * 0.5;
    }
  }

  findZoneTarget(enemies) {
    if (!this.assignedZone) {
      // Ranged, target nearest enemy
      return this.findNearestEnemy(enemies);
    }

    // Melee, prioritize enemies in your zone
    const zoneEnemies = enemies.filter(enemy => {
      if (!enemy.active) return false;
      const inTopHalf = enemy.position.y < 225;
      return this.assignedZone === 'top' ? inTopHalf : !inTopHalf;
    });

    if (zoneEnemies.length > 0) {
      return this.findNearestEnemyAvoidingCompanions(zoneEnemies);
    }

    // No enemies in zone, help with nearest enemy anywhere (but avoid doubling up)
    return this.findNearestEnemyAvoidingCompanions(enemies);
  }

  findNearestEnemyAvoidingCompanions(enemies) {
    // Check if other melee companions are targeting enemies
    const otherMeleeTargets = this.companions
      .filter(c => c !== this.entity && c.attackRange <= 100 && c.aiController)
      .map(c => c.aiController.currentTarget)
      .filter(t => t && t.active);

    // First, try to find an enemy that no one else is targeting
    let untargetedEnemy = null;
    let minUntargetedDistance = Infinity;

    enemies.forEach(enemy => {
      if (!enemy.active) return;
      const isBeingTargeted = otherMeleeTargets.some(target => target === enemy);
      if (!isBeingTargeted) {
        const distance = this.entity.position.distanceTo(enemy.position);
        if (distance < minUntargetedDistance) {
          minUntargetedDistance = distance;
          untargetedEnemy = enemy;
        }
      }
    });

    // If we found an untargeted enemy, use it
    if (untargetedEnemy) {
      return untargetedEnemy;
    }

    // Otherwise, fall back to nearest enemy (all are being targeted)
    return this.findNearestEnemy(enemies);
  }

  get currentTarget() {
    return this.target;
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
