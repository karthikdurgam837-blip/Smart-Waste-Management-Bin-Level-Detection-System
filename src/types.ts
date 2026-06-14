/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BinNode {
  id: string;
  name: string;
  location: string;
  type: 'Standard' | 'Recycle' | 'Organic';
  binHeightCm: number;
  currentFillCm: number;
  tempCelsius: number;
  humidityPercent: number;
  gasPpm: number;
  lat: number;
  lng: number;
  lastUpdated: string;
  status: 'Empty' | 'Half Full' | 'Nearly Full' | 'Full';
}

export interface BinLog {
  id: string;
  timestamp: string;
  nodeName: string;
  distanceCm: number;
  fillPercent: number;
  tempCelsius: number;
  gasPpm: number;
  status: 'Empty' | 'Half Full' | 'Nearly Full' | 'Full';
  alertTriggered: boolean;
}

export interface QuestionData {
  id: number;
  question: string;
  answer: string;
  evaluationKeywords: string[];
  tips: string;
}
