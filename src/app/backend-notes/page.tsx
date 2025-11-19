'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { useI18n } from '@/hooks/useI18n';
import { useNotification } from '@/hooks/useNotification';
import { BackendNote } from '@/api/types';
import { downloadFile } from '@/utils/downloadFile';
import { storage } from '@/utils/storage';

export default function BackendNotesPage() {
  const { t } = useI18n();
  const { success } = useNotification();

  const [notes, setNotes] = useState<BackendNote[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [type, setType] = useState<'Bug' | 'Missing' | 'Enhancement'>('Bug');

  useEffect(() => {
    const savedNotes = storage.get<BackendNote[]>('backendNotes') || [];
    setNotes(savedNotes);
  }, []);

  const handleAddNote = () => {
    if (!title || !description || !endpoint) return;

    const newNote: BackendNote = {
      id: Date.now().toString(),
      title,
      description,
      endpoint,
      type,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    storage.set('backendNotes', updatedNotes);

    setTitle('');
    setDescription('');
    setEndpoint('');
    setType('Bug');

    success(t('backendNotes.noteAdded'));
  };

  const handleDownload = () => {
    const content = notes
      .map((note) => {
        return `[${note.type}] ${note.title}\nEndpoint: ${note.endpoint}\nDescription: ${note.description}\nDate: ${new Date(note.createdAt).toLocaleString()}\n---\n`;
      })
      .join('\n');

    downloadFile(content, 'backend-fixes.txt', 'text/plain');
  };

  return (
    <MainLayout showHeader={false}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text mb-6">{t('backendNotes.title')}</h1>

        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-text mb-4">{t('backendNotes.addNote')}</h2>

          <div className="space-y-4">
            <Input
              label={t('backendNotes.noteTitle')}
              placeholder={t('backendNotes.titlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />

            <Textarea
              label={t('backendNotes.noteDescription')}
              placeholder={t('backendNotes.descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              fullWidth
            />

            <Input
              label={t('backendNotes.endpoint')}
              placeholder={t('backendNotes.endpointPlaceholder')}
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              fullWidth
            />

            <Select
              label={t('backendNotes.type')}
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              options={[
                { value: 'Bug', label: t('backendNotes.bug') },
                { value: 'Missing', label: t('backendNotes.missing') },
                { value: 'Enhancement', label: t('backendNotes.enhancement') },
              ]}
              fullWidth
            />

            <Button
              variant="primary"
              onClick={handleAddNote}
              disabled={!title || !description || !endpoint}
              fullWidth
            >
              {t('backendNotes.addNote')}
            </Button>
          </div>
        </Card>

        {notes.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-text">
                {t('backendNotes.noteAdded')} ({notes.length})
              </h2>
              <Button variant="accent" onClick={handleDownload}>
                {t('backendNotes.download')}
              </Button>
            </div>

            <div className="space-y-4">
              {notes.map((note) => (
                <Card key={note.id}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-text">{note.title}</h3>
                    <span className={`px-3 py-1 rounded text-sm ${
                      note.type === 'Bug' ? 'bg-error text-white' :
                      note.type === 'Missing' ? 'bg-accent text-text' :
                      'bg-success text-white'
                    }`}>
                      {note.type}
                    </span>
                  </div>
                  <p className="text-muted text-sm mb-2">
                    <strong>{t('backendNotes.endpoint')}:</strong> {note.endpoint}
                  </p>
                  <p className="text-text mb-2">{note.description}</p>
                  <p className="text-muted text-xs">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </Card>
              ))}
            </div>
          </>
        )}

        {notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">{t('backendNotes.noNotes')}</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
