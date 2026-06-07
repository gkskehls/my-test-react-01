// src/pages/AdminPage.tsx
import React, { useState } from 'react';
import { addSong } from '../firebase/songs';
import type { Song, SongNote } from '../songs/types';

const AdminPage: React.FC = () => {
    const [titleKey, setTitleKey] = useState('');
    const [categoryKey, setCategoryKey] = useState('category.childrens');
    const [difficultyKey, setDifficultyKey] = useState('difficulty.beginner');
    const [linesJson, setLinesJson] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        setIsSubmitting(true);

        let parsedLinesMap: Record<string, SongNote[]>;
        try {
            parsedLinesMap = JSON.parse(linesJson);
        } catch (error) {
            setStatus({ type: 'error', message: '악보 데이터(Lines)의 JSON 형식이 올바르지 않습니다.' });
            setIsSubmitting(false);
            return;
        }

        // Firestore 컨버터가 배열을 기대하므로, 맵을 정렬된 배열로 변환합니다.
        const sortedLines: SongNote[][] = Object.entries(parsedLinesMap)
            .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
            .map(([, line]) => line);

        const newSong: Omit<Song, 'id'> = {
            titleKey,
            categoryKey,
            difficultyKey,
            lines: sortedLines,
        };

        try {
            const docId = await addSong(newSong);
            setStatus({ type: 'success', message: `성공! 새로운 곡이 ID: ${docId} (으)로 추가되었습니다.` });
            // 폼 초기화
            setTitleKey('');
            setLinesJson('');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
            setStatus({ type: 'error', message: `오류 발생: ${errorMessage}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <h1>악보 추가</h1>
            <p>새로운 곡 정보를 입력하고, `new_song.json` 파일에서 "lines" 객체 내용을 아래 텍스트 영역에 붙여넣으세요.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="제목 키 (예: songs.newSong.title)"
                    value={titleKey}
                    onChange={(e) => setTitleKey(e.target.value)}
                    required
                    style={{ padding: '0.5rem' }}
                />
                <select value={categoryKey} onChange={(e) => setCategoryKey(e.target.value)} style={{ padding: '0.5rem' }}>
                    <option value="category.childrens">동요</option>
                    <option value="category.classical">클래식</option>
                </select>
                <select value={difficultyKey} onChange={(e) => setDifficultyKey(e.target.value)} style={{ padding: '0.5rem' }}>
                    <option value="difficulty.beginner">초급</option>
                    <option value="difficulty.intermediate">중급</option>
                </select>
                <textarea
                    placeholder='악보 데이터(Lines)를 JSON 형식으로 붙여넣으세요.'
                    value={linesJson}
                    onChange={(e) => setLinesJson(e.target.value)}
                    required
                    rows={15}
                    style={{ fontFamily: 'monospace', padding: '0.5rem' }}
                />
                <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem', cursor: 'pointer' }}>
                    {isSubmitting ? '추가하는 중...' : '악보 추가하기'}
                </button>
            </form>
            {status && (
                <p style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    borderRadius: '4px',
                    backgroundColor: status.type === 'success' ? '#e6fffa' : '#fff5f5',
                    color: status.type === 'success' ? '#2c7a7b' : '#c53030',
                }}>
                    {status.message}
                </p>
            )}
        </div>
    );
};

export default AdminPage;