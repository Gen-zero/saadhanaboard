import React from 'react';

export default function IntegrationManager({ advanced }: any) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Integrations</h2>
      {advanced.loading ? <div>Loading...</div> : (
        <div className="space-y-2">
          {advanced.integrations.map((i: any) => (
            <div key={i.id} className="p-2 border rounded">
              <div className="font-medium">{i.name}</div>
              <div className="text-xs text-muted-foreground">Provider: {i.provider}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
