import { saveAs } from 'file-saver'
import React, { useState, useEffect } from 'react';
import './App.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  // 職種別パラメータの初期値
  const [params, setParams] = useState({
    "リテール営業部1": {
      入社年収: "",  // 万円
      初期売上: "",  // 万円
      年収上昇率: "", // %
      売上上昇率: "", // %
      創出粗利率: "", // %
      初期社員数: 0   // 人
    },
    "リテール営業部2": {
      入社年収: "",
      初期売上: "",
      年収上昇率: "",
      売上上昇率: "",
      創出粗利率: "",
      初期社員数: 0
    },
    "リテール営業部3": {
      入社年収: "",
      初期売上: "",
      年収上昇率: "",
      売上上昇率: "",
      創出粗利率: "",
      初期社員数: 0
    },
    "法人仲介1": {
      入社年収: "",
      初期売上: "",
      年収上昇率: "",
      売上上昇率: "",
      創出粗利率: "",
      初期社員数: 0
    },
    "法人仲介2": {
      入社年収: "",
      初期売上: "",
      年収上昇率: "",
      売上上昇率: "",
      創出粗利率: "",
      初期社員数: 0
    },
    "法人仲介3": {
      入社年収: "",
      初期売上: "",
      年収上昇率: "",
      売上上昇率: "",
      創出粗利率: "",
      初期社員数: 0
    },
    "仕入営業1": {
      入社年収: "",
      初期売上: "",
      年収上昇率: "",
      売上上昇率: "",
      創出粗利率: "",
      初期社員数: 0
    },
    "仕入営業2": {
      入社年収: "",
      初期売上: "",
      年収上昇率: "",
      売上上昇率: "",
      創出粗利率: "",
      初期社員数: 0
    },
    "仕入営業3": {
      入社年収: "",
      初期売上: "",
      年収上昇率: "",
      売上上昇率: "",
      創出粗利率: "",
      初期社員数: 0
    }
  });

  // 人員計画の初期値
  const [staffPlan, setStaffPlan] = useState({});

  // シミュレーション結果
  const [results, setResults] = useState([]);
  
  // 人員関連の結果
  const [staffResults, setStaffResults] = useState([]);

  // パラメータが変更されたらシミュレーション実行
  useEffect(() => {
    // 初期人員計画の生成
    if (Object.keys(staffPlan).length === 0) {
      initializeStaffPlan();
    }
    runSimulation();
  }, [params, staffPlan]);

  // 初期人員計画の設定
  const initializeStaffPlan = () => {
    const departments = Object.keys(params);
    const newStaffPlan = {};
    
    departments.forEach(dept => {
      newStaffPlan[dept] = {
        '5期目': params[dept].初期社員数,
        '6期目': params[dept].初期社員数 + 1,
        '7期目': params[dept].初期社員数 + 2,
        '8期目': params[dept].初期社員数 + 3,
        '9期目': params[dept].初期社員数 + 4,
        '10期目': params[dept].初期社員数 + 5,
      };
    });
    
    setStaffPlan(newStaffPlan);
  };

  // パラメータ変更ハンドラ
  const handleParamChange = (dept, param, value) => {
    // 半角数字のみ許可する正規表現パターン（空文字と0も許可）
    const numericPattern = /^[0-9]*$/;
    
    // 空白または数字のみの場合は更新
    if (value === '' || numericPattern.test(value)) {
      setParams(prevParams => ({
        ...prevParams,
        [dept]: {
          ...prevParams[dept],
          [param]: value
        }
      }));
    }
  };

  // 人員計画変更ハンドラ
  const handleStaffPlanChange = (dept, year, value) => {
    // 半角数字のみ許可する正規表現パターン（空文字と0も許可）
    const numericPattern = /^[0-9]*$/;
    
    // 空白または数字のみの場合は更新
    if (value === '' || numericPattern.test(value)) {
      setStaffPlan(prevPlan => ({
        ...prevPlan,
        [dept]: {
          ...prevPlan[dept],
          [year]: value
        }
      }));
    }
  };

  // シミュレーション実行関数
  const runSimulation = () => {
    if (Object.keys(staffPlan).length === 0) return;
    
    const departments = Object.keys(params);
    const newResults = [];
    const newStaffResults = [];

    // 初期値のセットアップ（4期目までのデータは固定とする）
    const baseYears = [
      { year: '2020年度（1期目）', 総売上: 3000, 総経費: 2000, 総利益: 1000 },
      { year: '2021年度（2期目）', 総売上: 3300, 総経費: 2100, 総利益: 1200 },
      { year: '2022年度（3期目）', 総売上: 3600, 総経費: 2200, 総利益: 1400 },
      { year: '2023年度（4期目）', 総売上: 4000, 総経費: 2400, 総利益: 1600 }
    ];

    // 各年度ごとに部門データを追加
    baseYears.forEach((yearData, idx) => {
      const yearResult = { ...yearData };
      
      // 初期売上と売上上昇率のデフォルト値
      // 各部門の売上を設定
      departments.forEach(dept => {
        // 4期目までは初期値をベースにした簡易計算
        const initialSales = parseInt(params[dept].初期売上) || 0;
        const salesGrowthRate = parseFloat(params[dept].売上上昇率) || 0;
        const baseValue = initialSales * Math.pow(1 + salesGrowthRate / 100, idx);
        yearResult[dept] = Math.round(baseValue);
      });
      
      // 部門グループごとの集計
      yearResult['リテール営業部'] = Math.round(
        yearResult['リテール営業部1'] + yearResult['リテール営業部2'] + yearResult['リテール営業部3']
      );
      
      yearResult['法人仲介'] = Math.round(
        yearResult['法人仲介1'] + yearResult['法人仲介2'] + yearResult['法人仲介3']
      );
      
      yearResult['仕入営業'] = Math.round(
        yearResult['仕入営業1'] + yearResult['仕入営業2'] + yearResult['仕入営業3']
      );
      
      newResults.push(yearResult);
    });

    // 人員計画用の基本データを生成
    const staffBaseData = {
      department: '部門',
      '5期目': 0,
      '6期目': 0,
      '7期目': 0,
      '8期目': 0,
      '9期目': 0,
      '10期目': 0,
      '平均年収': 0
    };

    // 各部門の人員計画データを生成
    departments.forEach(dept => {
      const deptStaffData = { ...staffBaseData, department: dept };
      // 各期の人員数を設定
      for (let year = 5; year <= 10; year++) {
        const yearKey = `${year}期目`;
        const currentValue = staffPlan[dept]?.[yearKey];
        
        // 値が存在するか確認（空文字列や未定義ではない）
        if (currentValue !== undefined && currentValue !== '') {
          deptStaffData[yearKey] = parseInt(currentValue) || 0;
        } else {
          // デフォルト値（0ではなく初期社員数ベース）
          deptStaffData[yearKey] = params[dept].初期社員数 + (year - 5);
        }
      }
      
      // 平均年収計算 (5期目時点での年収)
      deptStaffData['平均年収'] = Math.round(
        (parseFloat(params[dept].入社年収) || 0) * 
        (1 + (parseFloat(params[dept].年収上昇率) || 0) / 100)
      );
      
      newStaffResults.push(deptStaffData);
    });

    // 部門グループごとの小計を追加
    const retailTotal = { ...staffBaseData, department: 'リテール営業部 計' };
    const corporateTotal = { ...staffBaseData, department: '法人仲介 計' };
    const acquisitionTotal = { ...staffBaseData, department: '仕入営業 計' };
    
    // 各グループの計算
    for (let year = 5; year <= 10; year++) {
      const yearKey = `${year}期目`;
      
      // リテール営業部の合計
      retailTotal[yearKey] = 
        (parseInt(staffPlan['リテール営業部1']?.[yearKey]) || 0) +
        (parseInt(staffPlan['リテール営業部2']?.[yearKey]) || 0) +
        (parseInt(staffPlan['リテール営業部3']?.[yearKey]) || 0);
      
      // 法人仲介の合計
      corporateTotal[yearKey] = 
        (parseInt(staffPlan['法人仲介1']?.[yearKey]) || 0) +
        (parseInt(staffPlan['法人仲介2']?.[yearKey]) || 0) +
        (parseInt(staffPlan['法人仲介3']?.[yearKey]) || 0);
      
      // 仕入営業の合計
      acquisitionTotal[yearKey] = 
        (parseInt(staffPlan['仕入営業1']?.[yearKey]) || 0) +
        (parseInt(staffPlan['仕入営業2']?.[yearKey]) || 0) +
        (parseInt(staffPlan['仕入営業3']?.[yearKey]) || 0);
    }
    
    // 平均年収（グループ内平均）
    retailTotal['平均年収'] = Math.round(
      ((parseFloat(params['リテール営業部1'].入社年収) || 0) + 
       (parseFloat(params['リテール営業部2'].入社年収) || 0) + 
       (parseFloat(params['リテール営業部3'].入社年収) || 0)) / 3
    );
    
    corporateTotal['平均年収'] = Math.round(
      ((parseFloat(params['法人仲介1'].入社年収) || 0) + 
       (parseFloat(params['法人仲介2'].入社年収) || 0) + 
       (parseFloat(params['法人仲介3'].入社年収) || 0)) / 3
    );
    
    acquisitionTotal['平均年収'] = Math.round(
      ((parseFloat(params['仕入営業1'].入社年収) || 0) + 
       (parseFloat(params['仕入営業2'].入社年収) || 0) + 
       (parseFloat(params['仕入営業3'].入社年収) || 0)) / 3
    );
    
    // グループ合計行を人員結果に追加
    newStaffResults.push(retailTotal);
    newStaffResults.push(corporateTotal);
    newStaffResults.push(acquisitionTotal);

    // 合計行を追加
    const totalStaffData = { ...staffBaseData, department: '合計' };
    for (let year = 5; year <= 10; year++) {
      const yearKey = `${year}期目`;
      totalStaffData[yearKey] = retailTotal[yearKey] + corporateTotal[yearKey] + acquisitionTotal[yearKey];
    }
    
    // 平均年収（全体平均）
    totalStaffData['平均年収'] = Math.round(
      (retailTotal['平均年収'] + corporateTotal['平均年収'] + acquisitionTotal['平均年収']) / 3
    );
    
    newStaffResults.push(totalStaffData);
    setStaffResults(newStaffResults);

    // 5期目から10期目までシミュレーション
    for (let year = 5; year <= 10; year++) {
      const yearResult = {
        year: `${2019 + year}年度（${year}期目）`,
        総売上: 0,
        総経費: 0,
        総利益: 0
      };

      // 各部門の計算
      departments.forEach(dept => {
        const prevYear = newResults[year - 2]; // 前年のデータ
        const deptParams = params[dept];
        
        // 人員数の取得（入力値または初期値）
        const staffCount = parseInt(staffPlan[dept]?.[`${year}期目`]);
        const staffValue = isNaN(staffCount) ? (deptParams.初期社員数 + (year - 5)) : staffCount;
        
        // 前年の人員数
        const prevStaffCount = parseInt(staffPlan[dept]?.[`${year-1}期目`]);
        const prevStaffValue = isNaN(prevStaffCount) ? (deptParams.初期社員数 + (year - 6)) : prevStaffCount;
        
        // 部門別売上計算
        const deptRevenue = Math.round(
          prevYear[dept] * 
          (1 + (parseFloat(deptParams.売上上昇率) || 0) / 100) * 
          (staffValue / Math.max(prevStaffValue, 1))
        );
        yearResult[dept] = deptRevenue;
        
        // 総計に加算
        yearResult.総売上 += deptRevenue;
        
        // 経費計算（人員数 × 平均年収で計算）
        const avgSalary = (parseFloat(deptParams.入社年収) || 0) * 
                          Math.pow(1 + (parseFloat(deptParams.年収上昇率) || 0) / 100, year - 4);
        const deptExpense = staffValue * avgSalary;
        yearResult.総経費 += Math.round(deptExpense);
      });
      
      // 部門グループごとの集計
      yearResult['リテール営業部'] = Math.round(
        yearResult['リテール営業部1'] + yearResult['リテール営業部2'] + yearResult['リテール営業部3']
      );
      
      yearResult['法人仲介'] = Math.round(
        yearResult['法人仲介1'] + yearResult['法人仲介2'] + yearResult['法人仲介3']
      );
      
      yearResult['仕入営業'] = Math.round(
        yearResult['仕入営業1'] + yearResult['仕入営業2'] + yearResult['仕入営業3']
      );
      
      // 総利益の計算
      yearResult.総利益 = yearResult.総売上 - yearResult.総経費;
      
      newResults.push(yearResult);
    }
    
    setResults(newResults);
  };
// CSV出力用の関数
const exportToCSV = () => {
  // 表示期間のデータのみを使用 (5期目以降)
  const dataToExport = results.slice(4);
  
  // CSVヘッダー行を作成
  const headers = [
    '年度', 
    'リテール営業部', 
    '法人仲介', 
    '仕入営業', 
    '総売上', 
    '総経費', 
    '総利益'
  ].join(',');
  
  // 各行のデータを整形
  const csvRows = dataToExport.map(row => {
    return [
      row.year,
      row['リテール営業部'] || 0,
      row['法人仲介'] || 0,
      row['仕入営業'] || 0,
      row.総売上,
      row.総経費,
      row.総利益
    ].join(',');
  });
  
  // ヘッダーと行データを結合
  const csvString = [headers, ...csvRows].join('\n');
  
  // CSVファイルを作成し、ダウンロード
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `不動産会社シミュレーション_${new Date().toISOString().slice(0, 10)}.csv`);
};

// 詳細な人員データをCSVとしてエクスポート
const exportStaffDataToCSV = () => {
  // ヘッダー行を作成
  const headers = [
    '部門',
    '5期目', 
    '6期目', 
    '7期目', 
    '8期目', 
    '9期目', 
    '10期目',
    '平均年収'
  ].join(',');
  
  // 各行のデータを整形
  const csvRows = staffResults.map(row => {
    return [
      row.department,
      row['5期目'],
      row['6期目'],
      row['7期目'],
      row['8期目'],
      row['9期目'],
      row['10期目'],
      row['平均年収']
    ].join(',');
  });
  
  // ヘッダーと行データを結合
  const csvString = [headers, ...csvRows].join('\n');
  
  // CSVファイルを作成し、ダウンロード
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `人員計画データ_${new Date().toISOString().slice(0, 10)}.csv`);
};
  // カスタムツールチップ内容の生成
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()}万円`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // グラフの色の定義
  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', 
    '#d0ed57', '#83a6ed', '#8dd1e1', '#a4add3', '#d0c4fe'
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>不動産会社 人員・業績シミュレーション</h1>
      </header>
      
      <div className="simulation-container">
        <div className="parameters">
          <h2>職種別パラメータ設定</h2>
          
          <table className="params-table">
            <thead>
              <tr>
                <th>部門</th>
                <th>入社年収（万円）</th>
                <th>売上（万円）</th>
                <th>年収上昇率（%）</th>
                <th>売上上昇率（%）</th>
                <th>創出粗利率（%）</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(params).map(dept => (
                <tr key={dept}>
                  <td>{dept}</td>
                  <td>
                    <input
                      type="text"
                      value={params[dept].入社年収}
                      onChange={(e) => handleParamChange(dept, '入社年収', e.target.value)}
                      pattern="[0-9]*"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={params[dept].初期売上}
                      onChange={(e) => handleParamChange(dept, '初期売上', e.target.value)}
                      pattern="[0-9]*"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={params[dept].年収上昇率}
                      onChange={(e) => handleParamChange(dept, '年収上昇率', e.target.value)}
                      pattern="[0-9]*"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={params[dept].売上上昇率}
                      onChange={(e) => handleParamChange(dept, '売上上昇率', e.target.value)}
                      pattern="[0-9]*"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={params[dept].創出粗利率}
                      onChange={(e) => handleParamChange(dept, '創出粗利率', e.target.value)}
                      pattern="[0-9]*"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="staff-plan">
          <h2>人員計画</h2>
          
          <table className="staff-table">
            <thead>
              <tr>
                <th>部門</th>
                <th>5期目</th>
                <th>6期目</th>
                <th>7期目</th>
                <th>8期目</th>
                <th>9期目</th>
                <th>10期目</th>
                <th>平均年収</th>
              </tr>
            </thead>
            <tbody>
              {staffResults
                .filter(row => !row.department.includes('計') && row.department !== '合計')
                .map((row, index) => (
                <tr key={index}>
                  <td>{row.department}</td>
                  {['5期目', '6期目', '7期目', '8期目', '9期目', '10期目'].map(year => (
                    <td key={year}>
                      <input
                        type="text"
                        value={staffPlan[row.department]?.[year] || ''}
                        onChange={(e) => handleStaffPlanChange(row.department, year, e.target.value)}
                        pattern="[0-9]*"
                      />
                    </td>
                  ))}
                  <td>{row['平均年収'].toLocaleString()}</td>
                </tr>
              ))}
              
              {/* リテール営業部合計行 */}
              {staffResults
                .filter(row => row.department === 'リテール営業部 計')
                .map((row, index) => (
                <tr key={`retail-total-${index}`} className="subtotal-row">
                  <td>{row.department}</td>
                  {['5期目', '6期目', '7期目', '8期目', '9期目', '10期目'].map(year => (
                    <td key={year} className="calculated-cell">{row[year]}</td>
                  ))}
                  <td className="calculated-cell">{row['平均年収'].toLocaleString()}</td>
                </tr>
              ))}
              
              {/* 法人仲介合計行 */}
              {staffResults
                .filter(row => row.department === '法人仲介 計')
                .map((row, index) => (
                <tr key={`corp-total-${index}`} className="subtotal-row">
                  <td>{row.department}</td>
                  {['5期目', '6期目', '7期目', '8期目', '9期目', '10期目'].map(year => (
                    <td key={year} className="calculated-cell">{row[year]}</td>
                  ))}
                  <td className="calculated-cell">{row['平均年収'].toLocaleString()}</td>
                </tr>
              ))}
              
              {/* 仕入営業合計行 */}
              {staffResults
                .filter(row => row.department === '仕入営業 計')
                .map((row, index) => (
                <tr key={`acq-total-${index}`} className="subtotal-row">
                  <td>{row.department}</td>
                  {['5期目', '6期目', '7期目', '8期目', '9期目', '10期目'].map(year => (
                    <td key={year} className="calculated-cell">{row[year]}</td>
                  ))}
                  <td className="calculated-cell">{row['平均年収'].toLocaleString()}</td>
                </tr>
              ))}
              
              {/* 総合計行 */}
              {staffResults
                .filter(row => row.department === '合計')
                .map((row, index) => (
                <tr key={`total-${index}`} className="total-row">
                  <td>{row.department}</td>
                  {['5期目', '6期目', '7期目', '8期目', '9期目', '10期目'].map(year => (
                    <td key={year} className="calculated-cell">{row[year]}</td>
                  ))}
                  <td className="calculated-cell">{row['平均年収'].toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="results">
  <h2>シミュレーション結果 
    <button 
      onClick={exportToCSV} 
      className="export-button"
    >
      業績CSVエクスポート
    </button>
    <button 
      onClick={exportStaffDataToCSV} 
      className="export-button"
    >
      人員CSVエクスポート
    </button>
  </h2>
  ...
          
          <div className="chart-container">
            <h3>年度別 部門種別売上内訳</h3>
            <div className="calculation-logic">
              <p><strong>算定ロジック:</strong></p>
              <ul>
                <li>各部門の売上 = 前年売上 × (1 + 売上上昇率) × (当年人員数 ÷ 前年人員数)</li>
                <li>部門グループ売上 = グループ内の各部門売上の合計</li>
                <li>総売上 = 全部門売上の合計</li>
              </ul>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={results.slice(4)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="リテール営業部" fill="#8884d8" />
                <Bar dataKey="法人仲介" fill="#82ca9d" />
                <Bar dataKey="仕入営業" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-container">
            <h3>年度別 部門詳細売上内訳</h3>
            <div className="calculation-logic">
              <p><strong>部門グループの集計:</strong></p>
              <ul>
                <li>リテール営業部 = リテール営業部1 + リテール営業部2 + リテール営業部3</li>
                <li>法人仲介 = 法人仲介1 + 法人仲介2 + 法人仲介3</li>
                <li>仕入営業 = 仕入営業1 + 仕入営業2 + 仕入営業3</li>
              </ul>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={results.slice(4)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="リテール営業部" stackId="a" fill="#8884d8" />
                <Bar dataKey="法人仲介" stackId="a" fill="#82ca9d" />
                <Bar dataKey="仕入営業" stackId="a" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-container">
            <h3>年度別 業績サマリー</h3>
            <div className="calculation-logic">
              <p><strong>算定ロジック:</strong></p>
              <ul>
                <li>総経費 = 全部門の (人員数 × 平均年収) の合計</li>
                <li>平均年収 = 入社年収 × (1 + 年収上昇率)^(経過年数)</li>
                <li>総利益 = 総売上 - 総経費</li>
              </ul>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={results.slice(4)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()}万円`} />
                <Legend />
                <Bar dataKey="総売上" fill="#8884d8" />
                <Bar dataKey="総経費" fill="#82ca9d" />
                <Bar dataKey="総利益" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="table-container">
            <h3>詳細データ</h3>
            <div className="calculation-logic">
              <p><strong>表示期間:</strong> 2024年度（5期目）～2029年度（10期目）のシミュレーション結果</p>
            </div>
            <table className="results-table">
              <thead>
                <tr>
                  <th>年度</th>
                  <th>リテール営業部</th>
                  <th>法人仲介</th>
                  <th>仕入営業</th>
                  <th>総売上</th>
                  <th>総経費</th>
                  <th>総利益</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(4).map((yearData, index) => (
                  <tr key={index}>
                    <td>{yearData.year}</td>
                    <td>{yearData['リテール営業部']?.toLocaleString() || '-'}</td>
                    <td>{yearData['法人仲介']?.toLocaleString() || '-'}</td>
                    <td>{yearData['仕入営業']?.toLocaleString() || '-'}</td>
                    <td>{yearData.総売上.toLocaleString()}</td>
                    <td>{yearData.総経費.toLocaleString()}</td>
                    <td>{yearData.総利益.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;