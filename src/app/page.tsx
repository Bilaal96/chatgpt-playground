'use client';

import { FormEvent, useState } from 'react';

import { Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import Link from 'next/link';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Can use code below if HTMLFormElement is not passed as param to FormEvent
      // Although using the generic type is preferred
      // const formData = new FormData(e.currentTarget);
      // const form = e.target as HTMLFormElement; // OR below
      // const form = e.currentTarget as HTMLFormElement;

      const form = e.currentTarget;
      const formData = new FormData(form);
      const prompt: string = form['ai-prompt'].value;
      console.log({ prompt });

      // Toggle `shouldUseFormData` to observe different methods of sending form data to Next Route Handler (via POST request)
      const shouldUseFormData = true; // Sends JSON request body when false
      const urlSegment = shouldUseFormData ? 'form-data' : 'json-body';
      const payload = shouldUseFormData ? formData : JSON.stringify({ prompt });
      const headers = shouldUseFormData
        ? undefined // FormData auto-sets { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

      const res = await fetch(`/api/process-prompt/${urlSegment}`, {
        method: 'POST',
        headers,
        body: payload,
      });
      const data = await res.json();

      // HTTP Status outside of 2XX
      if (!res.ok) {
        throw (
          data.error || new Error(`Request failed with status ${res.status}`)
        );
      }

      // Output
      console.log({ data });
      setResult(data.result[0].message.content);
      alert(`Form submitted\n${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      console.log(error);
      if (error.message) alert(error.message);
    }
  };

  return (
    <main className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold pt-4 mb-4">Chat GPT Bot</h1>

      <form id="ai-prompt" onSubmit={handleSubmit}>
        <Textarea
          className="rounded-none"
          name="ai-prompt"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />
        <Button type="submit">Submit</Button>
      </form>

      <p className="text-lg mt-4">{result}</p>
    </main>
  );
}
