lucide.createIcons();

      // API Key
      const APIKey =
        "6a4ce048dffdc0637965e1128a551b54983aa6e61cb28ec9df692c3184683d20";
      // End API Key

      // Fetching Analyze Data
      function fetchAnalyzeData(login) {
        const url = `https://socket.unfxco.com/mt5/api/analyze/basic?login=${login}`;
        return fetch(url, { headers: { APIKey } });
      }
      // End Fetching Analyze Data

      // Fetching Drawdown Data
      function fetchDrawdownData(login) {
        const url = `https://socket.unfxco.com/mt5/api/analyze/drawdown/chart?login=${login}`;
        return fetch(url, { headers: { APIKey } });
      }
      // End Fetching Drawdown Data

      function fetchHistoryPositionsData(login) {
        const url = `https://socket.unfxco.com/mt5/api/position/public/history?login=${login}`;
        return fetch(url, { headers: { APIKey } });
      }
      // End Fetching Drawdown Data

      // Summary Stats Functionality
      function formatValue(value) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      }

      function createSumStatCard(title, value, iconName) {
        var trendIcon =
          value >= 0
            ? '<i data-lucide="trending-up" class="text-[var(--success)] w-4 h-4"></i>'
            : '<i data-lucide="trending-down" class="text-[var(--danger)] w-4 h-4"></i>';

        return `
                    <div class="border border-[var(--border)] shadow-sm bg-[var(--primary)] rounded-xl px-3 py-4">
                      <div class="flex gap-1 flex-row items-center space-y-0 pb-2">
                        <i data-lucide="${iconName}" class="w-4 h-4 text-[var(--muted)]"></i>
                        <div class="text-sm font-medium">${title}</div>
                      </div>
                      <div>
                        <div class="text-xl font-semibold">${formatValue(
                          value
                        )}</div>
                        <p class="text-xs text-[var(--muted)] flex gap-1">
                          ${trendIcon} ${Math.abs(value).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  `;
      }

      function renderSumStats(data) {
        var statsContainer = $(".summary-card-content");
        statsContainer.empty();

        statsContainer.append(
          createSumStatCard("Profit", data.SumProfit, "dollar-sign")
        );
        statsContainer.append(
          createSumStatCard("Commission", data.SumCommission, "scale")
        );
        statsContainer.append(
          createSumStatCard("Net Profit", data.SumNetProfit, "dollar-sign")
        );
        statsContainer.append(
          createSumStatCard("Swap", data.SumSwap, "arrow-left-right")
        );
        statsContainer.append(
          createSumStatCard("Withdrawals", data.SumWithdrawals, "arrow-up")
        );
        statsContainer.append(
          createSumStatCard("Deposits", data.SumDeposits, "arrow-down")
        );
        statsContainer.append(
          createSumStatCard("Start Balance", data.StartBalance, "wallet")
        );
        statsContainer.append(
          createSumStatCard(
            "Balance Drawdown",
            data.BalanceDrawdown,
            "arrow-down"
          )
        );

        lucide.createIcons();
      }
      // End Summary Stats Functionality

      // Summary Charts Functionality
      const renderSumChart = (data) => {
        const formatChart = (name, value) => {
          return {
            name: name,
            originalValue: value,
            value: Math.abs(value).toFixed(2),
            backgroundColor: value < 0 ? "#f43f5e" : "#3b82f6",
          };
        };

        const dataChart = [
          formatChart("Sum Profit", data.SumProfit),
          formatChart("Sum Commission", data.SumCommission),
          formatChart("Sum Deposits", data.SumDeposits),
          formatChart("Sum Net Profit", data.SumNetProfit),
          formatChart("Sum Swap", data.SumSwap),
          formatChart("Sum Withdrawals", data.SumWithdrawals),
        ];

        const labels = dataChart.map((item) => item.name);
        const chartData = dataChart.map((item) => parseFloat(item.value));
        const backgroundColors = dataChart.map((item) => item.backgroundColor);

        const ctx = $("#summaryChart");
        const myChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Financial Overview",
                data: chartData,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
                borderRadius: 8,
                // barThickness: 30,
              },
            ],
          },
          options: {
            indexAxis: "y", // Set this for horizontal bars
            scales: {
              x: {
                beginAtZero: true,
                grid: {
                  display: true,
                  drawBorder: false,
                  // color: (context) => {},
                  borderDash: [3, 5],
                },
                ticks: {
                  padding: 10,
                  display: true,
                },
              },
              y: {
                grid: {
                  display: false,
                },
                ticks: {
                  padding: 15,
                  display: true,
                },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `Value: ${context.raw}`;
                  },
                },
              },
            },
            maintainAspectRatio: false,
            responsive: true,
          },
        });
      };
      // End Summary Charts Functionality

      // Prop Analyze Functionality
      const renderPropAnalyze = (data) => {
        const propData = [
          {
            label: "6 Day Trade",
            value: data.DayTrade,
            max: 6,
            icon: "clock",
            iconColor: "text-blue-400",
            status: data.DayTrade >= 6 ? "passed" : "stable",
            unit: "Day",
          },
          {
            label: "6 Day Complete Lot",
            value: data.DayTradeCompleteVolume,
            max: 6,
            icon: "trending-up",
            iconColor: "text-purple-400",
            status: data.DayTradeCompleteVolume >= 6 ? "passed" : "stable",
            unit: "Day",
          },
          {
            label: "3 Min Trade",
            value: data.TradeLimitTime,
            max: 3,
            icon: "activity",
            iconColor: "text-rose-400",
            status: data.TradeLimitTime >= 3 ? "rejected" : "passed",
            unit: "Trade",
          },
          {
            label: "Relative Drawdown",
            value: data.RelativeDrawdown,
            max: 3,
            icon: "percent",
            iconColor: "text-yellow-400",
            status: "none",
            unit: "%",
          },
        ];

        propData.forEach((item) => {
          const statusBadge = getStatusBadge(item.status);
          const fillColor = getFillColor(item.status);
          const chartId = `chart-${item.label
            .replace(/\s+/g, "-")
            .toLowerCase()}`;

          const html = `
                      <div class="space-y-4 shadow border border-[var(--border)] bg-[var(--primary)] rounded-2xl p-6">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-2">
                            <i data-lucide="${item.icon}" class="w-5 h-5 ${item.iconColor}"></i>
                            <span class="text-base font-semibold">${item.label}</span>
                          </div>
                          ${statusBadge}
                        </div>
                        <div class="flex items-center space-x-4">
                          <div><canvas id="${chartId}" width="80" height="80"></canvas></div>
                          <div>
                            <p class="text-xl font-semibold">${item.value} ${item.unit}</p>
                            <p class="text-sm text-gray-400">Progress</p>
                          </div>
                        </div>
                      </div>
                    `;

          $("#prop-analyze-content").append(html);

          lucide.createIcons();

          renderChart(chartId, item.value, item.max, fillColor);
        });

        function getStatusBadge(status) {
          switch (status) {
            case "passed":
              return '<span class="bg-[var(--badge-success)] text-[var(--badge-success-text)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Passed</span>';
            case "stable":
              return '<span class="bg-[var(--badge-info)] text-[var(--badge-info-text)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Stable</span>';
            case "rejected":
              return '<span class="bg-[var(--badge-danger)] text-[var(--badge-danger-text)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Rejected</span>';
            default:
              return '<span class="bg-[var(--secondary)] text-[var(--forground)] text-xs font-medium me-2 px-2.5 py-0.5 rounded">None</span>';
          }
        }

        function getFillColor(status) {
          switch (status) {
            case "passed":
              return "#22c55e";
            case "stable":
              return "#3b82f6";
            case "rejected":
              return "#f43f5e";
            default:
              return "#a855f7";
          }
        }

        function renderChart(chartId, value, max, fillColor) {
          const ctx = document.getElementById(chartId).getContext("2d");
          const step = 100 / max;
          new Chart(ctx, {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data:
                    value <= max ? [value * step, 100 - value * step] : [value],
                  backgroundColor: [fillColor, "#e5e7eb"],
                  borderWidth: 0,
                },
              ],
            },
            options: {
              // circumference: Math.PI,
              // rotation: -Math.PI,
              cutout: "70%",
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                animateRotate: true,
                animateScale: true,
              },
              plugins: {
                tooltip: { enabled: false },
              },
            },
          });
        }
      };
      // End Prop Analyze Functionality

      // Max Drawdowm Functionality
      const renderMaxDrawdown = (data) => {
        const maxDrawDownData = [
          {
            title: "Start",
            value: data.MaxStartBalanceDrawdown * 100,
            time: data.MaxStartBalanceDrawdownTime,
            max: data.PerStartRole,
          },
          {
            title: "EOD",
            value: data.MaxEODBalanceDrawdown * 100,
            time: data.MaxEODBalanceDrawdownTime,
            max: data.PerEODRole,
          },
          {
            title: "MAT",
            value: data.MaxAllTimeBalanceDrawdown * 100,
            time: data.MaxAllTimeBalanceDrawdownTime,
            max: data.PerStartRole,
          },
          {
            title: "MD",
            value: data.MaxDayBalanceDrawdown * 100,
            time: data.MaxDayBalanceDrawdownTime,
            max: data.PerMDRole,
          },
        ];

        maxDrawDownData.forEach(({ value, max, time, title }) => {
          const status = value < max ? "stable" : "rejected";

          const badge = getBadge(status);
          const progress = getProgress(value, max);

          const date = new Date(time);

          const html = `
                                <div class="overflow-hidden rounded-2xl border border-[var(--border)] shadow bg-[var(--primary)] p-4">
                                  <div class="flex flex-row justify-between items-center pb-4">
                                    <h2 class="text-base font-medium">${title} balance max drawdown</h2>
                                  </div>
                                  <div class="">
                                    <div class="flex items-center justify-between mb-2">
                                      <span class="text-2xl font-semibold drawdown-value">
                                        ${value.toFixed(2)}%
                                      </span>
                                      ${badge}
                                    </div>
                                    ${progress}
                                    <div class="flex justify-between text-xs text-[var(--muted)] mt-1">
                                      <span>${0}%</span>
                                      <span>${max}%</span>
                                    </div>
                                    <div
                                      class="flex items-center justify-between mt-2 text-xs text-[var(--muted)]"
                                    >
                                      <span>${value.toFixed(2)}% drawdown</span>
                                      <span>${date.toLocaleString()}</span>
                                    </div>
                                    <div class="flex items-center justify-center mt-2">
                                      ${
                                        value < max
                                          ? "<i data-lucide='check-circle-2' class='text-[var(--info)]'></i>"
                                          : "<i data-lucide='alert-circle' class='text-[var(--danger)]'></i>"
                                      }
                                    </div>
                                  </div>
                                </div>
                              `;

          $("#max-drawdown-content").append(html);

          lucide.createIcons();
        });

        function getBadge(status) {
          switch (status) {
            case "passed":
              return '<span class="bg-[var(--badge-success)] text-[var(--badge-success-text)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Passed</span>';
            case "stable":
              return '<span class="bg-[var(--badge-info)] text-[var(--badge-info-text)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Stable</span>';
            case "rejected":
              return '<span class="bg-[var(--badge-danger)] text-[var(--badge-danger-text)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Rejected</span>';
            default:
              return '<span class="bg-[var(--secondary)] text-[var(--forground)] text-xs font-medium me-2 px-2.5 py-0.5 rounded">None</span>';
          }
        }

        function getProgress(value, max) {
          const transform = `-${100 - value * (100 / max)}%`;

          return `
                                  <div class="relative h-3 w-full overflow-hidden rounded-full bg-[var(--secondary)]">
                                    <div
                                      class="h-full flex-1 transition-all transform ${
                                        value < max
                                          ? "bg-[var(--info)]"
                                          : "bg-[var(--danger)]"
                                      }"
                                      style="transform: translateX(${transform})"
                                    >
                                    </div>
                                  </div>
                                `;
        }
      };

      // End Max Drawdowm Functionality

      // History Charts
      const renderHistoryCharts = (balances, growthes) => {
        const $content = $("#history-charts-content");
        const $tabs = $(".history-tabs-button");
        const defaultTab = "balance";

        function switchTab(tabName) {
          $tabs.removeClass(
            "text-[var(--forground)] bg-[var(--background)] rounded-lg shadow"
          );
          $(`#${tabName}-tab`).addClass(
            "text-[var(--forground)] bg-[var(--background)] rounded-lg shadow"
          );

          if (tabName === "balance") {
            $("#balance").removeClass("hidden");
            $("#growth").addClass("hidden");
          }
          if (tabName === "growth") {
            $("#growth").removeClass("hidden");
            $("#balance").addClass("hidden");
          }
        }

        switchTab(defaultTab);

        $tabs.on("click", function () {
          const tabName = $(this).attr("id").replace("-tab", "");
          switchTab(tabName);
        });

        const balanceData = balances?.map((item) => ({
          x: new Date(item.Time).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          y: item.Balance.toFixed(2),
        }));

        const growthData = growthes?.map((item) => ({
          x: new Date(item.Time).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          y: item.Balance.toFixed(2),
        }));

        const balanceChartCtx = $("#balanceChart")[0].getContext("2d");
        const growthChartCtx = $("#growthChart")[0].getContext("2d");

        const balanceGradient = balanceChartCtx.createLinearGradient(
          0,
          0,
          0,
          450
        );
        balanceGradient.addColorStop(0, "rgba(59, 130, 246, 1)");
        balanceGradient.addColorStop(0.6, "rgba(59, 130, 246, 0.5)");
        balanceGradient.addColorStop(1, "rgba(59, 130, 246, 0.1)");

        const growthGradient = growthChartCtx.createLinearGradient(
          0,
          0,
          0,
          450
        );
        growthGradient.addColorStop(0, "rgba(153, 102, 255, 1)");
        growthGradient.addColorStop(0.5, "rgba(153, 102, 255, 0.8)");
        growthGradient.addColorStop(1, "rgba(153, 102, 255, 0.1)");

        const balanceChart = new Chart(balanceChartCtx, {
          type: "line",
          data: {
            datasets: [
              {
                label: "Balance",
                data: balanceData,
                borderColor: "#3b82f6",
                backgroundColor: balanceGradient,
                borderWidth: 1,
                pointStyle: "circle",
                pointRadius: 0,
                pointHoverRadius: 10,
                fill: true,
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: "category",
                grid: {
                  display: false,
                },
                ticks: {
                  maxTicksLimit: 20,
                  callback: function (value) {
                    return new Date(
                      this.getLabelForValue(value)
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  },
                },
              },
              y: {
                beginAtZero: false,
                grid: {
                  color: "#e5e5e5",
                  drawBorder: false,
                },
                ticks: {
                  count: 10,
                  callback: function (value) {
                    return `$${value.toFixed(2)}`;
                  },
                },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  title: function (context) {
                    return new Date(context[0].label).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    );
                  },
                  label: function (context) {
                    return `Balance: ${new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(context.raw.y)}`;
                  },
                },
              },
            },
          },
        });

        // Initialize Growth Chart
        const growthChart = new Chart(growthChartCtx, {
          type: "line",
          data: {
            datasets: [
              {
                label: "Growth",
                data: growthData,
                borderColor: "#a855f7",
                backgroundColor: growthGradient,
                borderWidth: 1,
                pointStyle: "circle",
                pointRadius: 0,
                pointHoverRadius: 10,
                fill: true,
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: "category",
                grid: {
                  display: false,
                },
                ticks: {
                  maxTicksLimit: 20,
                  callback: function (value) {
                    return new Date(
                      this.getLabelForValue(value)
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  },
                },
              },
              y: {
                beginAtZero: false,
                grid: {
                  color: "#e5e5e5",
                  drawBorder: false,
                },
                ticks: {
                  count: 10,
                  callback: function (value) {
                    return `${value.toFixed(2)}`;
                  },
                },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  title: function (context) {
                    return new Date(context[0].label).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    );
                  },
                  label: function (context) {
                    return `Growth: ${new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(context.raw.y)}`;
                  },
                },
              },
            },
          },
        });
      };
      // End History Charts

      // Trading Methods
      const renderTradimgMethodsChart = (data) => {
        const chartData = {
          labels: ["Mobile", "Client", "Web", "Algo"],
          datasets: [
            {
              label: "Percent",
              data: [
                data.CountMobileTradingPercentage,
                data.CountClientTradingPercentage,
                data.CountWebTradingPercentage,
                data.CountAlgoTradingPercentage,
              ],
              backgroundColor: "rgba(236, 72, 153, 0.6)",
              borderColor: "rgba(236, 72, 153, 1)",
              borderWidth: 1,
              pointBackgroundColor: "rgba(236, 72, 153, 1)",
            },
          ],
        };

        const tradingMethodsChart = new Chart(
          document.getElementById("tradingMethodsChart"),
          {
            type: "radar",
            data: chartData,
            options: {
              scales: {
                r: {
                  grid: {
                    circular: true, // This makes the grid circular
                  },
                  // angleLines: { display: false },
                  suggestedMin: 0,
                  suggestedMax: 100,
                  ticks: {
                    callback: (value) => `${value}%`,
                  },
                },
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `${context.raw}%`;
                    },
                  },
                },
              },
            },
          }
        );
      };

      const renderTradingMethods = (data) => {
        const platformData = [
          {
            label: "Mobile Trading",
            value: data.CountMobileTrading,
            percent: data.CountMobileTradingPercentage,
            icon: "smartphone",
            iconColor: "text-blue-500",
          },
          {
            label: "Client Trading",
            value: data.CountClientTrading,
            percent: data.CountClientTradingPercentage,
            icon: "briefcase",
            iconColor: "text-green-500",
          },
          {
            label: "Web Trading",
            value: data.CountWebTrading,
            percent: data.CountWebTradingPercentage,
            icon: "laptop-minimal",
            iconColor: "text-yellow-500",
          },
          {
            label: "Algo Trading",
            value: data.CountAlgoTrading,
            percent: data.CountAlgoTradingPercentage,
            icon: "cpu",
            iconColor: "text-purple-500",
          },
        ];

        const $tradingMethodsInfoCards = $("#tradingMethodsInfoCards");

        platformData.forEach((item) => {
          const cardHtml = `
                      <div class="rounded-lg flex flex-col items-center">
                        <div class="flex items-center gap-1.5">
                          <i data-lucide="${item.icon}" class="h-4 w-4 ${item.iconColor}"></i>
                          <span class="font-medium">${item.label}</span>
                        </div>
                        <div class="mt-1 flex flex-col items-center">
                          <p class="text-2xl font-semibold">${item.value}</p>
                          <p class="text-xs text-[var(--muted)]">
                            ${item.percent}
                            <i data-lucide="percent" class="h-3 w-3 inline-block"></i> of total
                          </p>
                        </div>
                      </div>
                    `;
          $tradingMethodsInfoCards.append(cardHtml);

          lucide.createIcons();
        });
      };
      // End Trading Methods

      // Profit vs Loss
      const renderProfitVsLoss = (data) => {
        $("#profitPercentage").text(`${data.CountProfitTradesPercentage}%`);
        $("#profitCount").text(`${data.CountProfitTrades} Profit`);
        $("#lossPercentage").text(`${data.CountLossTradesPercentage}%`);
        $("#lossCount").text(`${data.CountLossTrades} Loss`);
        $("#totalTrades").text(data.CountTrades);
        $("#count-all-trades").text(data.CountTrades);
        $("#profitFactor").text(data.ProfitFactor);
        $("#dayTradeAverage").text(`${data.CountDayTrade} Day Trade average`);
      };

      const renderProfitVsLossChart = (data) => {
        const ctx = document
          .getElementById("countTradeRadialChart")
          .getContext("2d");
        const countTradeRadialChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Profit", "Loss"],
            datasets: [
              {
                data: [data.CountProfitTrades, data.CountLossTrades],
                backgroundColor: ["#3b82f6", "#f43f5e"],
                hoverBackgroundColor: ["#60a5fa", "#fb7185"],
                borderWidth: 5,
                cutout: "70%",
                rotation: 270, // start angle at the top
              },
            ],
          },
          options: {
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || "";
                    return label + ": " + context.raw + " Trades";
                  },
                },
              },
            },
            circumference: 180, // 180-degree chart
            rotation: 270, // rotate to start at the top
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      };
      // End Profit vs Loss

      // Now Status
      const renderNowStatus = (data) => {
        const {
          Equity,
          Balance,
          Margin,
          FreeMargin,
          FreeMarginDrawdown,
          MarginLevel,
          Profit,
          StartBalanceDrawdown,
          MinBalanceEquity,
          MaxBalanceEquity,
        } = data;

        const stats = [
          {
            icon: "dollar-sign",
            color: "text-blue-500",
            label: "Balance",
            value: `$${Balance.toFixed(2)}`,
          },
          {
            icon: "trending-up",
            color: "text-green-500",
            label: "Equity",
            value: `$${Equity.toFixed(2)}`,
          },
          {
            icon: "arrow-up-circle",
            color: "text-purple-500",
            label: "Free Margin",
            value: `$${FreeMargin.toFixed(2)}`,
          },
          {
            icon: "arrow-down-circle",
            color: "text-red-500",
            label: "Free Margin Drawdown",
            value: `${FreeMarginDrawdown.toFixed(2)}%`,
          },
          {
            icon: "percent",
            color: "text-yellow-500",
            label: "Margin Level",
            value: `${MarginLevel.toFixed(2)}%`,
          },
          {
            icon: "activity",
            color: "text-indigo-500",
            label: "Profit",
            value: `$${Profit.toFixed(2)}`,
          },
          {
            icon: "bar-chart-2",
            color: "text-pink-500",
            label: "Start Balance Drawdown",
            value: `$${StartBalanceDrawdown.toFixed(2)}`,
          },
          {
            icon: "dollar-sign",
            color: "text-cyan-500",
            label: "Margin",
            value: `$${Margin.toFixed(2)}`,
          },
        ];

        // Line chart for balance range
        const lineChartData = {
          labels: ["Min", "Current", "Max"],
          datasets: [
            {
              label: "Value",
              data: [MinBalanceEquity, Balance, MaxBalanceEquity],
              borderColor: "#ec4899",
              borderWidth: 1,
              fill: false,
            },
          ],
        };

        new Chart($("#balanceRangeChart"), {
          type: "line",
          data: lineChartData,
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: {
                grid: {
                  display: true,
                  color: "#d1d5db",
                },
              },
              y: {
                grid: {
                  display: true,
                  color: "#d1d5db",
                },
                ticks: {
                  count: 5,
                },
              },
            },
          },
        });

        // Area chart for account overview
        const areaChartData = {
          labels: ["Balance", "Equity", "Free Margin", "Margin"],
          datasets: [
            {
              label: "Value",
              data: [Balance, Equity, FreeMargin, Margin],
              borderColor: "#3b82f6",
              backgroundColor: "#3b82f685",
              fill: true,
            },
          ],
        };

        new Chart($("#accountOverviewChart"), {
          type: "line",
          data: areaChartData,
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: {
                grid: {
                  display: true,
                  color: "#d1d5db",
                },
              },
              y: {
                grid: {
                  display: true,
                  color: "#d1d5db",
                },
                ticks: {
                  count: 5,
                },
              },
            },
          },
        });

        stats.forEach((stat) => {
          $("#statsContainer").append(`
                  <div class="flex items-center space-x-2">
                    <div>
                      <p class="text-sm text-[var(--muted)] flex items-center gap-2">
                        <i data-lucide=${stat.icon} class="w-3.5 h-3.5 ${stat.color}"></i>
                        <span class="truncate max-w-[120px]">${stat.label}</span>
                      </p>
                      <p class="text-lg font-semibold">${stat.value}</p>
                    </div>
                  </div>
                `);
        });

        lucide.createIcons();
      };
      // End Now Status

      // Positions Table
      const renderPositionsOrdersTable = (Positions, Orders) => {
        const formattedDate = (dateString) => {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const seconds = String(date.getSeconds()).padStart(2, "0");
          const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

          return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}.${milliseconds}`;
        };

        console.log(Positions);

        function calculateTotal(data, key) {
          return data.reduce((total, item) => total + (item[key] || 0), 0);
        }

        const totalRow = (name, data) => {
          const totalNowPrice = calculateTotal(data, "NowPrice");
          const totalSwap = calculateTotal(data, "Swap");
          const totalProfit = calculateTotal(data, "Profit");
          const totalReason = calculateTotal(data, "Reason");

          const profitClass =
            totalProfit > 0 ? "text-green-500" : "text-rose-500";
          const profitIcon = totalProfit > 0 ? "trending-up" : "trending-down";

          return `
              <tr class=" text-black text-xs font-medium">
                <td class="px-4 py-3">
                  <span class="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded">  
                    ${name}
                  </span>
                </td>
                <td colspan="7"></td>
                <td class="px-6 py-3">$${totalNowPrice.toFixed(2)}</td>
                <td class="px-6 py-3">${totalSwap.toFixed(2)}</td>
                <td class="px-6 py-3 flex items-center gap-1 ${profitClass}">
                  ${totalProfit.toFixed(2)}
                  <i data-lucide="${profitIcon}" class="w-3.5 h-3.5"></i>
                </td>
              </tr>
            `;
        };

        const $tableBody = $("#positions-orders-table-body");
        $tableBody.empty();

        if (Positions.length && Orders.length) {
          $tableBody.append(`
            <tr>
              <td colspan="12" class="text-center py-4">No data available</td>
            </tr>
          `);
        } else {
          Positions?.forEach((position) => {
            const formattedOpenTime = formattedDate(position.OpenTime);
            const profitClass =
              position.Profit > 0 ? "text-green-500" : "text-rose-500";
            const profitIcon =
              position.Profit > 0 ? "trending-up" : "trending-down";

            const typeClass =
              position.TypeString === "buy"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800";

            const row = `
              <tr class="odd:bg-white even:bg-gray-50 border-b last:border-none">
                <td class="px-6 py-4">${position.Ticket}</td>
                <td class="px-6 py-4">${position.Symbol}</td>
                <td class="px-6 py-4">${formattedOpenTime}</td>
                <td class="px-6 py-4">
                  <span class="${typeClass} text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                    ${position.TypeString}
                  </span>
                </td>
                <td class="px-6 py-4">${position.Volume}</td>
                <td class="px-6 py-4">$${position.OpenPrice.toFixed(2)}</td>
                <td class="px-6 py-4">${position.StopLoss}</td>
                <td class="px-6 py-4">${position.TakeProfit}</td>
                <td class="px-6 py-4">$${position.NowPrice}</td>
                <td class="px-6 py-4">${position.Swap}</td>
                <td class="px-6 py-4 flex items-center gap-1 ${profitClass}">
                  ${position.Profit}
                  <i data-lucide="${profitIcon}" class="w-3.5 h-3.5"></i>
                </td>
                <td class="px-6 py-4">${position.ReasonString}</td>
              </tr>
            `;

            $tableBody.append(row);
          });

          if (Positions.length) {
            const totalPositionsRow = totalRow("Positions", Positions);
            $tableBody.append(totalPositionsRow);
          }

          Orders?.forEach((order) => {
            const formattedOpenTime = formattedDate(order.OpenTime);
            const profitClass =
              order.Profit > 0 ? "text-green-500" : "text-rose-500";
            const profitIcon =
              order.Profit > 0 ? "trending-up" : "trending-down";

            const row = `
              <tr class="odd:bg-white even:bg-gray-50 border-b last:border-none">
                <td class="px-6 py-4">${order.Ticket}</td>
                <td class="px-6 py-4">${order.Symbol}</td>
                <td class="px-6 py-4">${formattedOpenTime}</td>
                <td class="px-6 py-4">${order.TypeString}</td>
                <td class="px-6 py-4">${order.Volume}</td>
                <td class="px-6 py-4">${order.OpenPrice}</td>
                <td class="px-6 py-4">${order.StopLoss}</td>
                <td class="px-6 py-4">${order.TakeProfit}</td>
                <td class="px-6 py-4">$${order.NowPrice}</td>
                <td class="px-6 py-4">${order.Swap}</td>
                <td class="px-6 py-4 flex items-center gap-1 ${profitClass}">
                  ${order.Profit}
                  <i data-lucide="${profitIcon}" class="w-3.5 h-3.5"></i>
                </td>
                <td class="px-6 py-4">${order.ReasonString}</td>
              </tr>
            `;

            $tableBody.append(row);
          });

          if (Orders.length) {
            const totalOrdersRow = totalRow("Orders", Orders);
            $tableBody.append(totalOrdersRow);
          }
        }
        lucide.createIcons();
      };
      // End Positions Table

      // Chart Drawdown
      function renderChartDrawdown(data) {
        const labels = data.map((item) =>
          new Date(item.Time).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );

        const datasets = [
          {
            label: "Balance",
            data: data.map((item) => item.Balance),
            borderColor: "#eab308",
          },
          {
            label: "Min Equity",
            data: data.map((item) => item.MinEquity),
            borderColor: "#ec4899",
          },
          {
            label: "Max Equity",
            data: data.map((item) => item.MaxEquity),
            borderColor: "#3b82f6",
          },
          {
            label: "Start Balance",
            data: data.map((item) => item.StartBalance),
            borderColor: "#22c55e",
          },
          {
            label: "EOD Balance",
            data: data.map((item) => item.EODBalance),
            borderColor: "#a855f7",
          },
          {
            label: "MAT Balance",
            data: data.map((item) => item.MATBalance),
            borderColor: "#14b8a6",
          },
          {
            label: "MD Balance",
            data: data.map((item) => item.MDBalance),
            borderColor: "#f97316",
          },
        ];

        const ctx = document.getElementById("chart-drawdown").getContext("2d");
        new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: datasets.map((dataset) => ({
              ...dataset,
              tension: 0.1, // Smooth line curve
              borderWidth: 2,
              pointRadius: 0,
            })),
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true }, // Show the legend for labels
            },
            scales: {
              x: {
                type: "category",
                grid: {
                  display: false,
                },
                ticks: { maxTicksLimit: 20 },
              },
              y: {
                beginAtZero: false,
                grid: {
                  color: "#e5e5e5",
                  drawBorder: false,
                },
                ticks: {
                  count: 10,
                  callback: function (value) {
                    return `${value.toFixed(2)}`;
                  },
                },
              },
            },
          },
        });
      }
      // End Chart Drawdown

      // History Positions Table
      const renderHistoryPositionsTable = (data) => {
        const newDataformatted = data.map((item) => {
          const {
            Ticket,
            Symbol,
            OpenTime,
            Type,
            Volume,
            OpenPrice,
            ClosePrice,
            CloseTime,
            PositionDuration,
            Commission,
            Swap,
            Profit,
            Reason,
          } = item;

          return [
            Ticket,
            Symbol,
            OpenTime,
            Type,
            Volume,
            OpenPrice,
            ClosePrice,
            CloseTime,
            PositionDuration,
            Commission,
            Swap,
            Profit,
            Reason,
          ];
        });

        $("#history-positions-table").DataTable({
          data: newDataformatted,
          paging: true,
          searching: true,
          ordering: true,
          info: true,
          pageLength: 10,
        });
      };
      // End History Positions Table

      $(document).ready(async function () {
        // Tab switching logic
        const MainTabElements = [
          {
            id: "analyze",
            triggerEl: $("#analyze-tab"),
            targetEl: $("#analyze"),
          },
          {
            id: "history",
            triggerEl: $("#history-tab"),
            targetEl: $("#history"),
          },
        ];

        const MainTabOptions = {
          defaultTabId: "analyze",
          activeClasses:
            "text-[var(--foreground)] rounded-lg bg-[var(--primary)] border-none shadow",
          inactiveClasses: "text-[var(--muted)] hover:text-[var(--muted)]/90",
          onShow: () => {},
        };

        function showTab(tabId) {
          MainTabElements.forEach((tab) => {
            if (tab.id === tabId) {
              tab.triggerEl
                .addClass(MainTabOptions.activeClasses)
                .removeClass(MainTabOptions.inactiveClasses);
              tab.targetEl.removeClass("hidden");
              MainTabOptions.onShow();
            } else {
              tab.triggerEl
                .removeClass(MainTabOptions.activeClasses)
                .addClass(MainTabOptions.inactiveClasses);
              tab.targetEl.addClass("hidden");
            }
          });
        }

        showTab(MainTabOptions.defaultTabId);

        $(".main-tab-button").on("click", function () {
          const tabId = $(this).attr("id").split("-")[0];
          showTab(tabId);
        });
        // End Tabs Switching

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const login = urlParams.get("login");

        if (login) {
          console.log("login");

          $("#analyze-loading").removeClass("hidden");
          $("#analyze-error").addClass("hidden");
          $("#analyze").addClass("hidden");

          fetchAnalyzeData(login)
            .then((res) => res.json())
            .then((data) => {
              $("#analyze-loading").addClass("hidden");
              $("#analyze").removeClass("hidden");

              const {
                Summary,
                PropAnalyze,
                NowStatus,
                HistoryBalance,
                HistoryGrowth,
                CountTrade,
                Positions,
                Orders,
              } = data;

              const { LimitVolume, ...res } = PropAnalyze;
              const newPropAnalyze = {
                ...res,
                RelativeDrawdown: NowStatus.RelativeDrawdown,
              };

              // Display Summary
              renderSumStats(Summary);
              renderSumChart(Summary);
              // End Display Summary

              // Display Prop Analyze
              renderPropAnalyze(newPropAnalyze);
              // End Display Prop Analyze

              // Display History Charts
              renderHistoryCharts(HistoryBalance, HistoryGrowth);
              // End Display History Charts

              // Display Trading Methods
              renderTradingMethods(CountTrade);
              renderTradimgMethodsChart(CountTrade);
              // End Display Trading Methods

              // Display Now Status
              renderNowStatus(NowStatus);
              // End Display Now Status

              // Display Profit vs Loss
              renderProfitVsLoss(CountTrade);
              renderProfitVsLossChart(CountTrade);
              // End Display Profit vs Loss

              // Display Positions & Orders Table
              renderPositionsOrdersTable(Positions, Orders);
              // End Display Positions & Orders Table
            })
            .catch((error) => {
              $("#analyze").addClass("hidden");
              $("#analyze-loading").addClass("hidden");
              $("#analyze-error").removeClass("hidden");
              $("#analyze-error-message").text(error.message);
            });
          // End Fetching Analyze Data

          // Fetching Drawdown Data
          $("#max-drawdown-loading").removeClass("hidden");
          $("#chart-drawdown-loading").removeClass("hidden");
          $("#max-drawdown-content").addClass("hidden");
          $("#analyze-error").addClass("hidden");

          fetchDrawdownData(login)
            .then((res) => res.json())
            .then((data) => {
              $("#max-drawdown-loading").addClass("hidden");
              $("#chart-drawdown-loading").addClass("hidden");
              $("#max-drawdown-content").removeClass("hidden");

              const {
                MaxAllTimeBalanceDrawdown,
                MaxAllTimeBalanceDrawdownTime,
                MaxDayBalanceDrawdown,
                MaxDayBalanceDrawdownTime,
                MaxEODBalanceDrawdown,
                MaxEODBalanceDrawdownTime,
                MaxFloatingDrawdown,
                MaxFloatingDrawdownTime,
                MaxStartBalanceDrawdown,
                MaxStartBalanceDrawdownTime,
                ChartDrawdown,
                ShowChartDrawdown,
              } = data;

              // Display Max Drawdown
              renderMaxDrawdown({
                ...ShowChartDrawdown,
                MaxAllTimeBalanceDrawdown,
                MaxAllTimeBalanceDrawdownTime,
                MaxDayBalanceDrawdown,
                MaxDayBalanceDrawdownTime,
                MaxEODBalanceDrawdown,
                MaxEODBalanceDrawdownTime,
                MaxFloatingDrawdown,
                MaxFloatingDrawdownTime,
                MaxStartBalanceDrawdown,
                MaxStartBalanceDrawdownTime,
              });
              // End Display Max Drawdown

              // Display Chart Drawdown
              renderChartDrawdown(ChartDrawdown);
              // End Display Chart Drawdown
            })
            .catch((error) => {
              $("#analyze").addClass("hidden");
              $("#analyze-error").removeClass("hidden");
              $("#analyze-error-message").text(error.message);
            });
          // End Fetching Drawdown Data

          // Fetching History Positions
          $("#history-positions-content").addClass("hidden");
          $("#history-positions-loading").removeClass("hidden");
          fetchHistoryPositionsData(login)
            .then((res) => res.json())
            .then((data) => {
              $("#history-positions-loading").addClass("hidden");
              $("#history-positions-content").removeClass("hidden");

              renderHistoryPositionsTable(data);
            })
            .catch((error) => {
              $("#history-positions-content").addClass("hidden");
              $("#analyze-error").removeClass("hidden");
              $("#analyze-error-message").text(error.message);
            });
          // End Fetching History Positions
        } else {
          $("#analyze-loading").addClass("hidden");
          $("#analyze-error").removeClass("hidden");
          $("#analyze-error-message").text("Parameter Invalid.");
          $("#history-positions-content").addClass("hidden");
        }
