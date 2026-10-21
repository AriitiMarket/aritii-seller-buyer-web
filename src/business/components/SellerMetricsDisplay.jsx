/**
 * FIX #13: Seller Metrics Display Component
 * Shows KPIs on seller dashboard with trend arrows
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { TiArrowUp, TiArrowDown } from 'react-icons/ti';
import sellerMetricsService from '@/business/services/sellerMetrics.service';

const SellerMetricsDisplay = () => {
  const activeShop = useSelector((state) => state.seller?.activeShopId);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('daily');

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sellerMetricsService.getDashboardSummary(activeShop, {
        period,
      });
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    } finally {
      setLoading(false);
    }
  }, [activeShop, period]);

  useEffect(() => {
    if (activeShop) {
      fetchMetrics();
    }
  }, [activeShop, fetchMetrics]);

  if (!metrics) return null;

  const MetricCard = ({ title, value, subtext, trend }) => {
    const isPositive = trend && !trend.startsWith('-');

    return (
      <Card sx={{ height: '100%', boxShadow: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography
                color="textSecondary"
                gutterBottom
                sx={{ fontSize: 12, fontWeight: 600 }}
              >
                {title}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, my: 1 }}>
                {value}
              </Typography>
              {subtext && (
                <Typography
                  variant="body2"
                  sx={{ fontSize: 12, color: 'text.secondary' }}
                >
                  {subtext}
                </Typography>
              )}
            </Box>
            {trend && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: isPositive ? 'success.main' : 'error.main',
                  bgcolor: isPositive ? 'success.light' : 'error.light',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                {isPositive ? (
                  <TiArrowUp style={{ fontSize: 18 }} />
                ) : (
                  <TiArrowDown style={{ fontSize: 18 }} />
                )}
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* Period Selector */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          size="small"
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {metrics.summaryCards?.map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <MetricCard
                title={card.title}
                value={card.value}
                subtext={card.subtext}
                trend={card.trend}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default SellerMetricsDisplay;
