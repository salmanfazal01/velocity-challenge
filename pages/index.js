import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  IconButton,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { cleanData, runTransactions, sortData } from "../src/utils";

const Home = () => {
  const [file, setFile] = useState(null);
  const fileName = file?.name;
  const [data, setData] = useState(null);
  const [results, setResults] = useState(null);
  const [sortedResults, setSortedResults] = useState(null);
  const [sortParams, setSortParams] = useState(null);

  const totalAccepted = results?.reduce((total, { accepted }) => {
    if (accepted) return total + 1;
    return total;
  }, 0);
  const totalRejected = results?.length - totalAccepted;

  const handleUpload = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    e.target.value = null;
  };

  useEffect(() => {
    if (file) {
      cleanData(file, setData);
    }
  }, [file]);

  useEffect(() => {
    if (data) {
      const output = runTransactions(data);
      setResults(output);
      setSortedResults(output);
    }
  }, [data]);

  useMemo(() => {
    if (sortParams) {
      const _sorted = sortData(results, sortParams);
      setSortedResults(_sorted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortParams]);

  const handleSortClicked = (column, type) => {
    // [column, order, type]
    if (sortParams?.[0] === column) {
      setSortParams([column, !sortParams[0], type]);
    } else {
      setSortParams([column, true, type]);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ my: 5 }}>
      {/* Top Banner */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {/* Left side */}
        <Box>
          {!fileName ? (
            <Typography>Please upload a .txt file</Typography>
          ) : (
            <Typography>File Name: {fileName}</Typography>
          )}
          <label htmlFor="contained-button-file">
            <input
              accept=".txt"
              id="contained-button-file"
              type="file"
              onChange={handleUpload}
              hidden
            />
            <Button variant="contained" component="span">
              Upload
            </Button>
          </label>
        </Box>
        {/* Right side */}
        <Box>
          <Typography>Total Accepted: {totalAccepted || 0}</Typography>
          <Typography>Total Rejected: {totalRejected || 0}</Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={5}>
        {/* Left Input Table */}
        <Grid item xs={12} md={6}>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "70vh", overflow: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Load Amount</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              {data && (
                <TableBody>
                  {data.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.customer_id}</TableCell>
                      <TableCell>{row.load_amount}</TableCell>
                      <TableCell>
                        {moment.utc(row.time).format("lll")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Grid>

        {/* Right Output Table */}
        <Grid item xs={12} md={6}>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "70vh", overflow: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    ID
                    {results && (
                      <IconButton
                        size="small"
                        sx={{ ml: 1 }}
                        onClick={() => handleSortClicked("id", "string")}
                      >
                        S
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>
                    Customer ID
                    {results && (
                      <IconButton
                        size="small"
                        sx={{ ml: 1 }}
                        onClick={() =>
                          handleSortClicked("customer_id", "string")
                        }
                      >
                        S
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>
                    Accepted
                    {results && (
                      <IconButton
                        size="small"
                        sx={{ ml: 1 }}
                        onClick={() => handleSortClicked("accepted", "boolean")}
                      >
                        S
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              </TableHead>
              {sortedResults && (
                <TableBody>
                  {sortedResults.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.customer_id}</TableCell>
                      <TableCell>{row.accepted?.toString?.()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
