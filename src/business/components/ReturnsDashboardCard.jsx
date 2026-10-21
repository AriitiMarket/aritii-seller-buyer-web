/**
 * FIX #15: Returns Dashboard Card
 * Shows pending, approved, inspecting, completed return counts
 * Quick access to returns management
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, Grid, Box, Typography, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import returnsService from '@/business/services/returns.service';

const ReturnsDashboardCard = ({ onNavigate }) => {
  const activeShop = useSelector((state) => state.seller?.activeShopId);
  const [dashboard, setDashboard] = useState(null);
  const [, setLoading] = useState(false);

  const fetchReturnsData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await returnsService.getSellerReturnsDashboard(activeShop);
      setDashboard(data.dashboard);
    } catch (err) {
      console.error('Failed to fetch returns data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeShop]);

  useEffect(() => {
    if (activeShop) {
      fetchReturnsData();
    }
  }, [activeShop, fetchReturnsData]);

  if (!dashboard) return null;

  const stats = [
    { label: 'Pending', count: dashboard.pending, color: 'warning' },
    { label: 'Approved', count: dashboard.approved, color: 'info' },
    { label: 'Inspecting', count: dashboard.inspecting, color: 'primary' },
    { label: 'Completed', count: dashboard.completed, color: 'success' },
  ];

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 1 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Returns Management
          </Typography>
          <Button
            size="small"
            color="primary"
            onClick={() => onNavigate?.('/returns')}
          >
            View All →
          </Button>
        </Box>

        <Grid container spacing={2}>
          {stats.map((stat, idx) => (
            <Grid item xs={6} sm={3} key={idx}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: `${stat.color}.main`,
                    mb: 0.5,
                  }}
                >
                  {stat.count}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {dashboard.totalValue > 0 && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total Return Value:
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: 'error.main', display: 'inline', ml: 1 }}
              >
                ${dashboard.totalValue.toFixed(2)}
              </Typography>
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ReturnsDashboardCard;
