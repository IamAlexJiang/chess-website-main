import { useState } from "react";
import api from "../../ajax";
import { Message, Input } from '@arco-design/web-react';
import { formatMoves } from './moveFormatter';
const Record = ({ list, onSave }) => { 
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Format moves for display
  const formattedMoves = formatMoves(list);
  
  const save = async () => {
    if (!name) {
      Message.error({ content: 'Please enter name', duration: 2000 });
      return;
    }
    if (!list.length) {
      Message.error({ content: 'Please move the chess piece', duration: 2000 });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const result = await api.board.postBoard(name, list);
      
      // Debug: Log the raw result from API
      console.log('Save result received:', result, 'Type:', typeof result);
      
      // Handle different response formats
      let recordId = null;
      
      // The server returns: { code: 200, content: "id_string" }
      // After interceptor, result should be the ID string or the content value
      
      console.log('Raw save result:', result, 'Type:', typeof result, 'IsArray:', Array.isArray(result));
      
      if (result !== null && result !== undefined && result !== false) {
        // Format 1: Direct ID string (expected after interceptor)
        if (typeof result === 'string' && result.length > 0) {
          recordId = result;
        }
        // Format 2: Number (timestamp-based ID)
        else if (typeof result === 'number') {
          recordId = String(result);
        }
        // Format 3: Object with id property
        else if (result && typeof result === 'object' && !Array.isArray(result)) {
          if (result.id) {
            recordId = String(result.id);
          }
          // Format 4: Object with code and content (if interceptor didn't process it)
          else if (result.code === 200 && result.content) {
            recordId = typeof result.content === 'string' || typeof result.content === 'number' 
              ? String(result.content) 
              : (result.content?.id ? String(result.content.id) : null);
          }
          // Format 5: Object with data.id
          else if (result.data) {
            if (typeof result.data === 'string' || typeof result.data === 'number') {
              recordId = String(result.data);
            } else if (result.data.id) {
              recordId = String(result.data.id);
            }
          }
          // Format 6: Object with message and id inside
          else if (result.message && result.id) {
            recordId = String(result.id);
          }
        }
        // Format 7: Boolean true means success but no ID - generate one
        else if (result === true) {
          recordId = String(Date.now());
        }
      }
      
      console.log('Extracted recordId:', recordId, 'Result was:', result);
      
      if (recordId && recordId !== 'null' && recordId !== 'undefined') {
        // Ensure recordId is a string
        const idString = String(recordId);
        Message.success({ 
          content: `Game "${name}" saved successfully!`, 
          duration: 3000 
        });
        onSave(idString, { name, value: list, id: idString });
        setName('');
      } else {
        console.error('Save failed - no valid recordId found.');
        console.error('Raw result:', result);
        console.error('Result type:', typeof result);
        console.error('Result keys:', result && typeof result === 'object' ? Object.keys(result) : 'N/A');
        Message.error({ 
          content: `Failed to save game. Please check the console for details.`, 
          duration: 5000 
        });
      }
    } catch (error) {
      console.error('Error saving game:', error);
      Message.error({ 
        content: `Error saving game: ${error.message}`, 
        duration: 3000 
      });
    } finally {
      setIsSaving(false);
    }
  }

  return <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif' }}>
    <div style={{ display: 'flex', width: '100%', marginBottom: '30px' }}>
      <b style={{ lineHeight: '30px', fontSize: '14px' }}>Name: </b>
      <Input placeholder='Please enter manual name' style={{ flex:1, margin: '0 20px', height: '30px', padding: '0 10px', fontSize: '14px' }} value={name} onChange={(value) => setName(value)} />
    </div>
    {name ? <b style={{ fontSize: '16px', marginBottom: '10px' }}>{name}</b> : <b style={{ fontSize: '16px', marginBottom: '10px' }}>Manual</b>}
    <div style={{ flex: 1, marginBottom: '10px', overflowY: 'auto', paddingRight: '20px' }}>
      {
        formattedMoves.length > 0 ? (
          formattedMoves.map((move, index) => {
            return (
              <div key={index} style={{ display: 'flex', padding: '10px 0', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                <span style={{ 
                  fontFamily: '"Georgia", "Times New Roman", serif', 
                  fontSize: '15px', 
                  lineHeight: '1.6',
                  letterSpacing: '0.3px',
                  color: '#333',
                  fontWeight: '400'
                }}>{move.full}</span>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '10px 0', color: '#999', fontStyle: 'italic' }}>No moves yet</div>
        )
      }
    </div>
    <button 
      className="chess-btn" 
      style={{ margin:'0 20px 0 0' }} 
      onClick={save}
      disabled={isSaving}
    >
      {isSaving ? 'Saving...' : 'Save'}
    </button>
  </div>
}
export default Record;