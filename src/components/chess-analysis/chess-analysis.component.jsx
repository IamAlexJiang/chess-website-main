import React, { useState } from 'react';
import { Message, Spin, Tabs, Card } from '@arco-design/web-react';
import StockfishAnalyzer from '../stockfish-analyzer/stockfish-analyzer.component';
import './chess-analysis.styles.scss';

const ChessAnalysis = ({ 
  moves = [], 
  aiAnalysis = null, 
  isLoadingAnalysis = false,
  onAnalysisComplete 
}) => {
  const [activeTab, setActiveTab] = useState('ai');

  const TabPane = Tabs.TabPane;

  return (
    <div className="chess-analysis">
      <Card title="Chess Analysis" className="analysis-card">
        <Tabs 
          activeTab={activeTab} 
          onChange={setActiveTab}
          className="analysis-tabs"
        >
          <TabPane key="ai" title="AI Commentary">
            <div className="ai-analysis-content">
              {isLoadingAnalysis ? (
                <div className="loading-container">
                  <Spin size="large" />
                  <p>Getting AI analysis...</p>
                </div>
              ) : aiAnalysis ? (
                <div className="analysis-results">
                  <div className="analysis-section">
                    <h4>AI Commentary</h4>
                    <p className="commentary">{aiAnalysis.commentary}</p>
                  </div>
                  
                  {aiAnalysis.predictedMove && (
                    <div className="analysis-section">
                      <h4>Predicted Opponent Move</h4>
                      <p className="predicted-move">{aiAnalysis.predictedMove}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-analysis">
                  <p>Make a move to get AI analysis</p>
                </div>
              )}
            </div>
          </TabPane>

          <TabPane key="stockfish" title="Stockfish Engine">
            <div className="stockfish-analysis-content">
              <StockfishAnalyzer 
                moves={moves}
                onAnalysisComplete={onAnalysisComplete}
              />
            </div>
          </TabPane>

          <TabPane key="comparison" title="Compare Analysis">
            <div className="comparison-content">
              <div className="comparison-grid">
                <div className="comparison-section">
                  <h4>AI Commentary</h4>
                  {aiAnalysis ? (
                    <div className="comparison-result">
                      <p><strong>Commentary:</strong> {aiAnalysis.commentary}</p>
                      {aiAnalysis.predictedMove && (
                        <p><strong>Predicted Move:</strong> {aiAnalysis.predictedMove}</p>
                      )}
                    </div>
                  ) : (
                    <p className="no-data">No AI analysis available</p>
                  )}
                </div>

                <div className="comparison-section">
                  <h4>Stockfish Engine</h4>
                  <p className="info-text">
                    Use the Stockfish tab to get engine analysis with best moves, 
                    evaluations, and principal variations.
                  </p>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ChessAnalysis;

