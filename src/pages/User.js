import axios from 'axios';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { CSVLink } from "react-csv";
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'nombre', label: 'Nombre', alignRight: false },
  { id: 'apellido', label: 'Apellido', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'telefono', label: 'Teléfono', alignRight: false },
  { id: 'latitud', label: 'Latitud', alignRight: false },
  { id: 'longitud', label: 'Longitud', alignRight: false },
  { id: 'esPotencial', label: 'Potencial', alignRight: false },
  { id: 'vendedor', label: 'Vendedor', alignRight: false }
]

const csvHeaders = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'email', label: 'Email' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'latitud', label: 'Latitud' },
  { key: 'longitud', label: 'Longitud' },
  { key: 'esPotencial', label: 'Potencial' },
  { key: 'vendedor', label: 'Vendedor' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.nombre.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('nombre');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(50);

  const [clients, setClients] = useState([]);

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("https://potenciales.herokuapp.com/api/clients", {
          headers: {
            "Content-type": "application/json",
            "x-access-token": localStorage.getItem("token")
          }
        });
        setClients(response.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    }
    loadClients();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = clients.map((n) => n.nombre);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clients.length) : 0;

  const filteredUsers = applySortFilter(clients, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Lista de clientes">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Lista de clientes
          </Typography>
          <Button variant="contained" component={RouterLink} to="/dashboard/client/create" startIcon={<Iconify icon="eva:plus-fill" />}>
            Nuevo cliente
          </Button>
          <Button variant="contained">
            <CSVLink
              data={clients}
              headers={csvHeaders}
              filename={"potenciales.csv"}
            >
              <Typography variant='button' color={'white'}>
                EXPORTAR CSV</Typography>
            </CSVLink>
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, maxWidth: 1500 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={clients.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, nombre, apellido, email, telefono, latitud, longitud, esPotencial, vendedor } = row;
                    const isItemSelected = selected.indexOf(nombre) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, nombre)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={nombre} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {nombre}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{apellido}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{telefono}</TableCell>
                        <TableCell align="left">{latitud}</TableCell>
                        <TableCell align="left">{longitud}</TableCell>
                        <TableCell align="left">{esPotencial ? 'Si' : 'No'}</TableCell>
                        <TableCell align="left">{vendedor}</TableCell>
                        <TableCell align="right">
                          <UserMoreMenu />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isLoading && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        Loading...
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {isUserNotFound && !isLoading && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[50, 100, 200]}
            component="div"
            count={clients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
