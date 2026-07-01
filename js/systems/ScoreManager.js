import { Storage } from '../utils/Storage.js';

export class ScoreManager {
  constructor() {
    this.currentScore = 0;
    this.currentCombo = 0;
    this.comboTimer = 0;
    this.comboTimeout = 3000; // 3 seconds to maintain combo
  }

  reset() {
    this.currentScore = 0;
    this.currentCombo = 0;
    this.comboTimer = 0;
  }

  addPoints(basePoints, comboMultiplier = 1) {
    // Apply combo multiplier
    let multiplier = 1;
    if (this.currentCombo >= 10) {
      multiplier = 2.0;
    } else if (this.currentCombo >= 5) {
      multiplier = 1.5;
    }

    const points = Math.floor(basePoints * multiplier * comboMultiplier);
    this.currentScore += points;
    return points;
  }

  incrementCombo() {
    this.currentCombo++;
    this.comboTimer = this.comboTimeout;
  }

  updateCombo(dt) {
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.currentCombo = 0;
        this.comboTimer = 0;
      }
    }
  }

  // High score management
  saveHighScore(mode, difficulty, character, score, initials = null) {
    const key = `${mode}_${difficulty}`; // e.g., "story_easy", "endless_hard"
    const highScores = this.getHighScores(key);

    const newEntry = {
      score: score,
      character: character,
      initials: initials,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    highScores.push(newEntry);

    // Sort by score descending
    highScores.sort((a, b) => b.score - a.score);

    // Keep top 10
    const top10 = highScores.slice(0, 10);

    Storage.save(key, top10);

    // Check rank
    const rank = top10.findIndex(entry =>
      entry.score === score &&
      entry.timestamp === newEntry.timestamp
    ) + 1;

    return {
      rank: rank,
      isHighScore: rank > 0,
      isNewRecord: rank === 1
    };
  }

  getHighScores(key) {
    const scores = Storage.load(key);
    return Array.isArray(scores) ? scores : [];
  }

  getAllHighScores() {
    return {
      story_easy: this.getHighScores('story_easy'),
      story_hard: this.getHighScores('story_hard'),
      endless_easy: this.getHighScores('endless_easy'),
      endless_hard: this.getHighScores('endless_hard')
    };
  }

  getTopScore(mode, difficulty) {
    const key = `${mode}_${difficulty}`;
    const scores = this.getHighScores(key);
    return scores.length > 0 ? scores[0].score : 0;
  }

  clearAllHighScores() {
    Storage.remove('story_easy');
    Storage.remove('story_hard');
    Storage.remove('endless_easy');
    Storage.remove('endless_hard');
  }

  formatScore(score) {
    return score.toString().padStart(8, '0');
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
