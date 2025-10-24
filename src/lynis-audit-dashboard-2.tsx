import React, { useState } from 'react';
import { Upload, Shield, AlertTriangle, CheckCircle, XCircle, Info, FileText, TrendingUp, Server, Calendar } from 'lucide-react';

export default function LynisAuditDashboard() {
  const [auditData, setAuditData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const parseReportFile = async (file) => {
    const text = await file.text();
    const lines = text.split('\n');
    
    const data = {
      systemInfo: {},
      hardening: { index: 0, tests: 0 },
      warnings: [],
      suggestions: [],
      tests: [],
      categories: {},
      reportDate: null
    };

    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      
      // Hardening index
      if (key === 'hardening_index') {
        data.hardening.index = parseInt(value) || 0;
      }
      
      // Report date
      if (key === 'report_datetime_end') {
        data.reportDate = value;
      }
      
      // System info
      if (key === 'hostname') data.systemInfo.hostname = value;
      if (key === 'os') data.systemInfo.os = value;
      if (key === 'os_fullname') data.systemInfo.osFullname = value;
      if (key === 'os_version') data.systemInfo.version = value;
      if (key === 'kernel_version') data.systemInfo.kernel = value;
      if (key === 'linux_version') data.systemInfo.linuxVersion = value;
      
      // Warnings
      if (key === 'warning[]') {
        data.warnings.push(value);
      }
      
      // Suggestions
      if (key === 'suggestion[]') {
        data.suggestions.push(value);
      }
      
      // Tests performed - count lines starting with 'test['
      if (key && key.startsWith('test[')) {
        data.hardening.tests++;
      }
    });

    setAuditData(data);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      parseReportFile(file);
    }
  };

  const getHardeningColor = (index) => {
    if (index >= 80) return 'text-green-600';
    if (index >= 60) return 'text-yellow-600';
    if (index >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHardeningBgColor = (index) => {
    if (index >= 80) return 'from-green-50 to-emerald-50 border-green-200';
    if (index >= 60) return 'from-yellow-50 to-amber-50 border-yellow-200';
    if (index >= 40) return 'from-orange-50 to-red-50 border-orange-200';
    return 'from-red-50 to-rose-50 border-red-200';
  };

  const getHardeningLabel = (index) => {
    if (index >= 80) return 'Excellent';
    if (index >= 60) return 'Bon';
    if (index >= 40) return 'Moyen';
    return 'Faible';
  };

  if (!auditData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard Audit Lynis</h1>
            <p className="text-slate-600">Visualisez et analysez vos rapports de sécurité système</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-200">
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <h2 className="text-xl font-semibold mb-4 text-slate-700">Charger un rapport Lynis</h2>
              <p className="text-slate-600 mb-6">
                Uploadez le fichier de rapport généré par Lynis (généralement /var/log/lynis-report.dat)
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".dat,.txt,.log"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition inline-block">
                  Sélectionner un fichier
                </span>
              </label>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-3">Comment générer un rapport Lynis :</h3>
              <div className="bg-slate-50 p-4 rounded font-mono text-sm text-slate-700">
                sudo lynis audit system
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Le rapport sera généré dans /var/log/lynis-report.dat
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Rapport d'Audit Lynis</h1>
                {auditData.systemInfo.hostname && (
                  <p className="text-slate-600">
                    {auditData.systemInfo.hostname} - {auditData.systemInfo.osFullname || auditData.systemInfo.os}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setAuditData(null)}
              className="px-4 py-2 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Charger un autre rapport
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('warnings')}
              className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                activeTab === 'warnings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Alertes ({auditData.warnings.length})
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                activeTab === 'suggestions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Recommandations ({auditData.suggestions.length})
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-6 py-3 font-medium transition whitespace-nowrap ${
                activeTab === 'system'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Système
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Hardening Score */}
                <div className={`bg-gradient-to-r rounded-lg p-6 border ${getHardeningBgColor(auditData.hardening.index)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Indice de Durcissement</h3>
                      <p className="text-sm text-slate-600 mb-1">Score de sécurité global du système</p>
                      <p className={`text-sm font-semibold ${getHardeningColor(auditData.hardening.index)}`}>
                        {getHardeningLabel(auditData.hardening.index)}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${getHardeningColor(auditData.hardening.index)}`}>
                        {auditData.hardening.index}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">/ 100</div>
                    </div>
                  </div>
                  <div className="mt-4 bg-white bg-opacity-50 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        auditData.hardening.index >= 80 ? 'bg-green-500' :
                        auditData.hardening.index >= 60 ? 'bg-yellow-500' :
                        auditData.hardening.index >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${auditData.hardening.index}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Tests effectués</p>
                        <p className="text-2xl font-bold text-slate-800">{auditData.hardening.tests}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Alertes</p>
                        <p className="text-2xl font-bold text-slate-800">{auditData.warnings.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Recommandations</p>
                        <p className="text-2xl font-bold text-slate-800">{auditData.suggestions.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick System Info */}
                {auditData.systemInfo.hostname && (
                  <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Server className="w-5 h-5" />
                      Informations Système
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {auditData.systemInfo.hostname && (
                        <div>
                          <p className="text-sm text-slate-600">Nom d'hôte</p>
                          <p className="font-medium text-slate-800">{auditData.systemInfo.hostname}</p>
                        </div>
                      )}
                      {(auditData.systemInfo.osFullname || auditData.systemInfo.os) && (
                        <div>
                          <p className="text-sm text-slate-600">Système</p>
                          <p className="font-medium text-slate-800">{auditData.systemInfo.osFullname || auditData.systemInfo.os}</p>
                        </div>
                      )}
                      {auditData.reportDate && (
                        <div>
                          <p className="text-sm text-slate-600">Date du rapport</p>
                          <p className="font-medium text-slate-800">{auditData.reportDate}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Top Warnings Preview */}
                {auditData.warnings.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Aperçu des Alertes
                    </h3>
                    <div className="space-y-2">
                      {auditData.warnings.slice(0, 3).map((warning, idx) => (
                        <div key={idx} className="bg-orange-50 border border-orange-200 rounded p-3 text-sm text-slate-700">
                          {warning}
                        </div>
                      ))}
                      {auditData.warnings.length > 3 && (
                        <button
                          onClick={() => setActiveTab('warnings')}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Voir toutes les alertes ({auditData.warnings.length})
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'warnings' && (
              <div className="space-y-3">
                {auditData.warnings.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Aucune alerte détectée</h3>
                    <p className="text-slate-600">Votre système ne présente aucun problème critique</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {auditData.warnings.length} alerte{auditData.warnings.length > 1 ? 's' : ''} détectée{auditData.warnings.length > 1 ? 's' : ''}
                      </h3>
                    </div>
                    {auditData.warnings.map((warning, idx) => (
                      <div key={idx} className="bg-orange-50 border-l-4 border-orange-400 rounded-r-lg p-4 hover:shadow-md transition">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <p className="text-slate-700 text-sm flex-1">{warning}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-3">
                {auditData.suggestions.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Aucune recommandation</h3>
                    <p className="text-slate-600">Votre système est optimalement configuré</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {auditData.suggestions.length} recommandation{auditData.suggestions.length > 1 ? 's' : ''}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Améliorations suggérées pour renforcer la sécurité
                      </p>
                    </div>
                    {auditData.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4 hover:shadow-md transition">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-slate-700 text-sm flex-1">{suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Détails du Système
                  </h3>
                  <div className="space-y-3">
                    {auditData.systemInfo.hostname && (
                      <div className="flex justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-600 font-medium">Nom d'hôte</span>
                        <span className="text-slate-800">{auditData.systemInfo.hostname}</span>
                      </div>
                    )}
                    {auditData.systemInfo.os && (
                      <div className="flex justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-600 font-medium">OS</span>
                        <span className="text-slate-800">{auditData.systemInfo.os}</span>
                      </div>
                    )}
                    {auditData.systemInfo.osFullname && (
                      <div className="flex justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-600 font-medium">Nom complet OS</span>
                        <span className="text-slate-800">{auditData.systemInfo.osFullname}</span>
                      </div>
                    )}
                    {auditData.systemInfo.version && (
                      <div className="flex justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-600 font-medium">Version OS</span>
                        <span className="text-slate-800">{auditData.systemInfo.version}</span>
                      </div>
                    )}
                    {auditData.systemInfo.kernel && (
                      <div className="flex justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-600 font-medium">Version Kernel</span>
                        <span className="text-slate-800">{auditData.systemInfo.kernel}</span>
                      </div>
                    )}
                    {auditData.systemInfo.linuxVersion && (
                      <div className="flex justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-600 font-medium">Version Linux</span>
                        <span className="text-slate-800">{auditData.systemInfo.linuxVersion}</span>
                      </div>
                    )}
                    {auditData.reportDate && (
                      <div className="flex justify-between py-3">
                        <span className="text-slate-600 font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date du rapport
                        </span>
                        <span className="text-slate-800">{auditData.reportDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}