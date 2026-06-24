<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false);

$routes->get('/', 'Home::index');
$routes->options('(:any)', 'Options::index');

$routes->group('api', static function ($routes) {
    // Authentication
    $routes->post('login', 'Api\Auth::login');
    $routes->post('logout', 'Api\Auth::logout', ['filter' => 'apiauth']);

    // Public endpoints: tanpa login dan tidak menampilkan link admin.
    $routes->get('public/dashboard', 'Api\PublicController::dashboard');
    $routes->get('public/kategori', 'Api\PublicController::kategori');
    $routes->get('public/koleksi', 'Api\PublicController::koleksi');
    $routes->get('public/koleksi/(:num)', 'Api\PublicController::koleksiDetail/$1');
    $routes->get('public/cover/(:num)', 'Api\PublicController::cover/$1');

    // Admin endpoints: wajib Authorization Bearer Token.
    $routes->get('dashboard', 'Api\Dashboard::index', ['filter' => 'apiauth']);
    $routes->resource('kategori', ['controller' => 'Api\Kategori', 'filter' => 'apiauth']);
    $routes->post('koleksi/upload-create', 'Api\Koleksi::uploadCreate', ['filter' => 'apiauth']);
    $routes->post('koleksi/upload-update/(:num)', 'Api\Koleksi::uploadUpdate/$1', ['filter' => 'apiauth']);
    $routes->patch('koleksi/(:num)/toggle-terkini', 'Api\Koleksi::toggleTerkini/$1', ['filter' => 'apiauth']);
    $routes->resource('koleksi', ['controller' => 'Api\Koleksi', 'filter' => 'apiauth']);
    $routes->resource('anggota', ['controller' => 'Api\Anggota', 'filter' => 'apiauth']);
    $routes->resource('peminjaman', ['controller' => 'Api\Peminjaman', 'filter' => 'apiauth']);
});
