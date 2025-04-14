/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/auth/callback/route";
exports.ids = ["app/auth/callback/route"];
exports.modules = {

/***/ "(rsc)/./app/auth/callback/route.ts":
/*!************************************!*\
  !*** ./app/auth/callback/route.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var _supabase_ssr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/ssr */ \"(rsc)/./node_modules/@supabase/ssr/dist/module/index.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/supabase/config */ \"(rsc)/./lib/supabase/config.ts\");\n\n\n\n\nasync function GET(request) {\n    const requestUrl = new URL(request.url);\n    const code = requestUrl.searchParams.get(\"code\");\n    const redirectTo = requestUrl.searchParams.get(\"redirectTo\") || \"/\";\n    if (code) {\n        try {\n            const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n            const supabase = (0,_supabase_ssr__WEBPACK_IMPORTED_MODULE_0__.createServerClient)(_lib_supabase_config__WEBPACK_IMPORTED_MODULE_3__.supabaseConfig.url, _lib_supabase_config__WEBPACK_IMPORTED_MODULE_3__.supabaseConfig.anonKey, {\n                cookies: {\n                    get (name) {\n                        const cookie = cookieStore.get(name);\n                        return cookie?.value;\n                    },\n                    set (name, value, options) {\n                        try {\n                            cookieStore.set({\n                                name,\n                                value,\n                                ...options\n                            }) // Apply global cookie options\n                            ;\n                        } catch (error) {\n                            console.error(`Error al establecer cookie ${name}:`, error);\n                        }\n                    },\n                    remove (name, options) {\n                        try {\n                            cookieStore.delete({\n                                name,\n                                ...options\n                            }) // Apply global cookie options\n                            ;\n                        } catch (error) {\n                            console.error(`Error al eliminar cookie ${name}:`, error);\n                        }\n                    }\n                }\n            });\n            // Intercambiar el código por una sesión\n            const { error } = await supabase.auth.exchangeCodeForSession(code);\n            if (error) {\n                console.error(\"Error al intercambiar el código por una sesión:\", error);\n                return next_server__WEBPACK_IMPORTED_MODULE_2__.NextResponse.redirect(new URL(\"/signin?error=auth\", request.url));\n            }\n            // Verificar que la sesión se haya creado correctamente\n            const { data: { session } } = await supabase.auth.getSession();\n            if (!session) {\n                console.error(\"No se pudo crear la sesión\");\n                return next_server__WEBPACK_IMPORTED_MODULE_2__.NextResponse.redirect(new URL(\"/signin?error=session\", request.url));\n            }\n            console.log(\"Sesión creada correctamente, redirigiendo a\", redirectTo);\n            // Redirigir a la página solicitada\n            return next_server__WEBPACK_IMPORTED_MODULE_2__.NextResponse.redirect(new URL(redirectTo, request.url));\n        } catch (error) {\n            console.error(\"Error en la ruta de callback:\", error);\n            return next_server__WEBPACK_IMPORTED_MODULE_2__.NextResponse.redirect(new URL(\"/signin?error=unknown\", request.url));\n        }\n    }\n    // Si no hay código, redirigir a la página de inicio de sesión\n    return next_server__WEBPACK_IMPORTED_MODULE_2__.NextResponse.redirect(new URL(\"/signin?error=no-code\", request.url));\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXV0aC9jYWxsYmFjay9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFrRDtBQUNaO0FBQ3NCO0FBQ047QUFFL0MsZUFBZUksSUFBSUMsT0FBb0I7SUFDNUMsTUFBTUMsYUFBYSxJQUFJQyxJQUFJRixRQUFRRyxHQUFHO0lBQ3RDLE1BQU1DLE9BQU9ILFdBQVdJLFlBQVksQ0FBQ0MsR0FBRyxDQUFDO0lBQ3pDLE1BQU1DLGFBQWFOLFdBQVdJLFlBQVksQ0FBQ0MsR0FBRyxDQUFDLGlCQUFpQjtJQUVoRSxJQUFJRixNQUFNO1FBQ1IsSUFBSTtZQUNGLE1BQU1JLGNBQWNaLHFEQUFPQTtZQUUzQixNQUFNYSxXQUFXZCxpRUFBa0JBLENBQUNHLGdFQUFjQSxDQUFDSyxHQUFHLEVBQUVMLGdFQUFjQSxDQUFDWSxPQUFPLEVBQUU7Z0JBQzlFZCxTQUFTO29CQUNQVSxLQUFJSyxJQUFZO3dCQUNkLE1BQU1DLFNBQVNKLFlBQVlGLEdBQUcsQ0FBQ0s7d0JBQy9CLE9BQU9DLFFBQVFDO29CQUNqQjtvQkFDQUMsS0FBSUgsSUFBWSxFQUFFRSxLQUFhLEVBQUVFLE9BQVk7d0JBQzNDLElBQUk7NEJBQ0ZQLFlBQVlNLEdBQUcsQ0FBQztnQ0FBRUg7Z0NBQU1FO2dDQUFPLEdBQUdFLE9BQU87NEJBQUMsR0FBRyw4QkFBOEI7O3dCQUM3RSxFQUFFLE9BQU9DLE9BQU87NEJBQ2RDLFFBQVFELEtBQUssQ0FBQyxDQUFDLDJCQUEyQixFQUFFTCxLQUFLLENBQUMsQ0FBQyxFQUFFSzt3QkFDdkQ7b0JBQ0Y7b0JBQ0FFLFFBQU9QLElBQVksRUFBRUksT0FBWTt3QkFDL0IsSUFBSTs0QkFDRlAsWUFBWVcsTUFBTSxDQUFDO2dDQUFFUjtnQ0FBTSxHQUFHSSxPQUFPOzRCQUFDLEdBQUcsOEJBQThCOzt3QkFDekUsRUFBRSxPQUFPQyxPQUFPOzRCQUNkQyxRQUFRRCxLQUFLLENBQUMsQ0FBQyx5QkFBeUIsRUFBRUwsS0FBSyxDQUFDLENBQUMsRUFBRUs7d0JBQ3JEO29CQUNGO2dCQUNGO1lBQ0Y7WUFFQSx3Q0FBd0M7WUFDeEMsTUFBTSxFQUFFQSxLQUFLLEVBQUUsR0FBRyxNQUFNUCxTQUFTVyxJQUFJLENBQUNDLHNCQUFzQixDQUFDakI7WUFFN0QsSUFBSVksT0FBTztnQkFDVEMsUUFBUUQsS0FBSyxDQUFDLG1EQUFtREE7Z0JBQ2pFLE9BQU9uQixxREFBWUEsQ0FBQ3lCLFFBQVEsQ0FBQyxJQUFJcEIsSUFBSSxzQkFBc0JGLFFBQVFHLEdBQUc7WUFDeEU7WUFFQSx1REFBdUQ7WUFDdkQsTUFBTSxFQUNKb0IsTUFBTSxFQUFFQyxPQUFPLEVBQUUsRUFDbEIsR0FBRyxNQUFNZixTQUFTVyxJQUFJLENBQUNLLFVBQVU7WUFFbEMsSUFBSSxDQUFDRCxTQUFTO2dCQUNaUCxRQUFRRCxLQUFLLENBQUM7Z0JBQ2QsT0FBT25CLHFEQUFZQSxDQUFDeUIsUUFBUSxDQUFDLElBQUlwQixJQUFJLHlCQUF5QkYsUUFBUUcsR0FBRztZQUMzRTtZQUVBYyxRQUFRUyxHQUFHLENBQUMsK0NBQStDbkI7WUFFM0QsbUNBQW1DO1lBQ25DLE9BQU9WLHFEQUFZQSxDQUFDeUIsUUFBUSxDQUFDLElBQUlwQixJQUFJSyxZQUFZUCxRQUFRRyxHQUFHO1FBQzlELEVBQUUsT0FBT2EsT0FBTztZQUNkQyxRQUFRRCxLQUFLLENBQUMsaUNBQWlDQTtZQUMvQyxPQUFPbkIscURBQVlBLENBQUN5QixRQUFRLENBQUMsSUFBSXBCLElBQUkseUJBQXlCRixRQUFRRyxHQUFHO1FBQzNFO0lBQ0Y7SUFFQSw4REFBOEQ7SUFDOUQsT0FBT04scURBQVlBLENBQUN5QixRQUFRLENBQUMsSUFBSXBCLElBQUkseUJBQXlCRixRQUFRRyxHQUFHO0FBQzNFIiwic291cmNlcyI6WyIvVXNlcnMvanVsaWV0YWhhYmlmL0Rlc2t0b3AvYVF1aWVuRGVqb1ByaW1lcm8vYXBwL2F1dGgvY2FsbGJhY2svcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlU2VydmVyQ2xpZW50IH0gZnJvbSBcIkBzdXBhYmFzZS9zc3JcIlxuaW1wb3J0IHsgY29va2llcyB9IGZyb20gXCJuZXh0L2hlYWRlcnNcIlxuaW1wb3J0IHsgTmV4dFJlc3BvbnNlLCB0eXBlIE5leHRSZXF1ZXN0IH0gZnJvbSBcIm5leHQvc2VydmVyXCJcbmltcG9ydCB7IHN1cGFiYXNlQ29uZmlnIH0gZnJvbSBcIkAvbGliL3N1cGFiYXNlL2NvbmZpZ1wiXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3QgcmVxdWVzdFVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwpXG4gIGNvbnN0IGNvZGUgPSByZXF1ZXN0VXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJjb2RlXCIpXG4gIGNvbnN0IHJlZGlyZWN0VG8gPSByZXF1ZXN0VXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJyZWRpcmVjdFRvXCIpIHx8IFwiL1wiXG5cbiAgaWYgKGNvZGUpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY29va2llU3RvcmUgPSBjb29raWVzKClcblxuICAgICAgY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVTZXJ2ZXJDbGllbnQoc3VwYWJhc2VDb25maWcudXJsLCBzdXBhYmFzZUNvbmZpZy5hbm9uS2V5LCB7XG4gICAgICAgIGNvb2tpZXM6IHtcbiAgICAgICAgICBnZXQobmFtZTogc3RyaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBjb29raWUgPSBjb29raWVTdG9yZS5nZXQobmFtZSlcbiAgICAgICAgICAgIHJldHVybiBjb29raWU/LnZhbHVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBvcHRpb25zOiBhbnkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvb2tpZVN0b3JlLnNldCh7IG5hbWUsIHZhbHVlLCAuLi5vcHRpb25zIH0pIC8vIEFwcGx5IGdsb2JhbCBjb29raWUgb3B0aW9uc1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgYWwgZXN0YWJsZWNlciBjb29raWUgJHtuYW1lfTpgLCBlcnJvcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlbW92ZShuYW1lOiBzdHJpbmcsIG9wdGlvbnM6IGFueSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29va2llU3RvcmUuZGVsZXRlKHsgbmFtZSwgLi4ub3B0aW9ucyB9KSAvLyBBcHBseSBnbG9iYWwgY29va2llIG9wdGlvbnNcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGFsIGVsaW1pbmFyIGNvb2tpZSAke25hbWV9OmAsIGVycm9yKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBJbnRlcmNhbWJpYXIgZWwgY8OzZGlnbyBwb3IgdW5hIHNlc2nDs25cbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZXhjaGFuZ2VDb2RlRm9yU2Vzc2lvbihjb2RlKVxuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGFsIGludGVyY2FtYmlhciBlbCBjw7NkaWdvIHBvciB1bmEgc2VzacOzbjpcIiwgZXJyb3IpXG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UucmVkaXJlY3QobmV3IFVSTChcIi9zaWduaW4/ZXJyb3I9YXV0aFwiLCByZXF1ZXN0LnVybCkpXG4gICAgICB9XG5cbiAgICAgIC8vIFZlcmlmaWNhciBxdWUgbGEgc2VzacOzbiBzZSBoYXlhIGNyZWFkbyBjb3JyZWN0YW1lbnRlXG4gICAgICBjb25zdCB7XG4gICAgICAgIGRhdGE6IHsgc2Vzc2lvbiB9LFxuICAgICAgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0U2Vzc2lvbigpXG5cbiAgICAgIGlmICghc2Vzc2lvbikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gc2UgcHVkbyBjcmVhciBsYSBzZXNpw7NuXCIpXG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UucmVkaXJlY3QobmV3IFVSTChcIi9zaWduaW4/ZXJyb3I9c2Vzc2lvblwiLCByZXF1ZXN0LnVybCkpXG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKFwiU2VzacOzbiBjcmVhZGEgY29ycmVjdGFtZW50ZSwgcmVkaXJpZ2llbmRvIGFcIiwgcmVkaXJlY3RUbylcblxuICAgICAgLy8gUmVkaXJpZ2lyIGEgbGEgcMOhZ2luYSBzb2xpY2l0YWRhXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLnJlZGlyZWN0KG5ldyBVUkwocmVkaXJlY3RUbywgcmVxdWVzdC51cmwpKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZW4gbGEgcnV0YSBkZSBjYWxsYmFjazpcIiwgZXJyb3IpXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLnJlZGlyZWN0KG5ldyBVUkwoXCIvc2lnbmluP2Vycm9yPXVua25vd25cIiwgcmVxdWVzdC51cmwpKVxuICAgIH1cbiAgfVxuXG4gIC8vIFNpIG5vIGhheSBjw7NkaWdvLCByZWRpcmlnaXIgYSBsYSBww6FnaW5hIGRlIGluaWNpbyBkZSBzZXNpw7NuXG4gIHJldHVybiBOZXh0UmVzcG9uc2UucmVkaXJlY3QobmV3IFVSTChcIi9zaWduaW4/ZXJyb3I9bm8tY29kZVwiLCByZXF1ZXN0LnVybCkpXG59XG4iXSwibmFtZXMiOlsiY3JlYXRlU2VydmVyQ2xpZW50IiwiY29va2llcyIsIk5leHRSZXNwb25zZSIsInN1cGFiYXNlQ29uZmlnIiwiR0VUIiwicmVxdWVzdCIsInJlcXVlc3RVcmwiLCJVUkwiLCJ1cmwiLCJjb2RlIiwic2VhcmNoUGFyYW1zIiwiZ2V0IiwicmVkaXJlY3RUbyIsImNvb2tpZVN0b3JlIiwic3VwYWJhc2UiLCJhbm9uS2V5IiwibmFtZSIsImNvb2tpZSIsInZhbHVlIiwic2V0Iiwib3B0aW9ucyIsImVycm9yIiwiY29uc29sZSIsInJlbW92ZSIsImRlbGV0ZSIsImF1dGgiLCJleGNoYW5nZUNvZGVGb3JTZXNzaW9uIiwicmVkaXJlY3QiLCJkYXRhIiwic2Vzc2lvbiIsImdldFNlc3Npb24iLCJsb2ciXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/auth/callback/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase/config.ts":
/*!********************************!*\
  !*** ./lib/supabase/config.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabaseConfig: () => (/* binding */ supabaseConfig),\n/* harmony export */   validateSupabaseConfig: () => (/* binding */ validateSupabaseConfig)\n/* harmony export */ });\nconst supabaseConfig = {\n    url: \"https://wciwyktgdjezqrfvmxgs.supabase.co\" || 0 || 0,\n    anonKey: \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjaXd5a3RnZGplenFyZnZteGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDUyNzIsImV4cCI6MjA1Nzg4MTI3Mn0.l52miFhjgYWJHcUdMQcW-jkpa_RMaWCp8qmEuHMvgrM\" || 0 || 0,\n    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || \"\",\n    cookieOptions: {\n        // Add cookie options\n        sbSameSite: \"lax\",\n        sbSecure: \"development\" === \"production\",\n        sbDomain:  false ? 0 : undefined,\n        sbPath: \"/\"\n    }\n};\nfunction validateSupabaseConfig() {\n    if (!supabaseConfig.url) {\n        throw new Error(\"NEXT_PUBLIC_SUPABASE_URL o SUPABASE_URL no está definido\");\n    }\n    if (!supabaseConfig.anonKey) {\n        throw new Error(\"NEXT_PUBLIC_SUPABASE_ANON_KEY o SUPABASE_ANON_KEY no está definido\");\n    }\n    return true;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UvY29uZmlnLnRzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQU8sTUFBTUEsaUJBQWlCO0lBQzVCQyxLQUFLQywwQ0FBb0MsSUFBSUEsQ0FBd0IsSUFBSSxDQUFFO0lBQzNFSSxTQUFTSixrTkFBeUMsSUFBSUEsQ0FBNkIsSUFBSSxDQUFFO0lBQ3pGTyxnQkFBZ0JQLFFBQVFDLEdBQUcsQ0FBQ08seUJBQXlCLElBQUk7SUFDekRDLGVBQWU7UUFDYixxQkFBcUI7UUFDckJDLFlBQVk7UUFDWkMsVUFBVVgsa0JBQXlCO1FBQ25DWSxVQUFVWixNQUFxQyxHQUFHLENBQWlCLEdBQUdhO1FBQ3RFQyxRQUFRO0lBQ1Y7QUFDRixFQUFDO0FBRU0sU0FBU0M7SUFDZCxJQUFJLENBQUNqQixlQUFlQyxHQUFHLEVBQUU7UUFDdkIsTUFBTSxJQUFJaUIsTUFBTTtJQUNsQjtJQUNBLElBQUksQ0FBQ2xCLGVBQWVNLE9BQU8sRUFBRTtRQUMzQixNQUFNLElBQUlZLE1BQU07SUFDbEI7SUFDQSxPQUFPO0FBQ1QiLCJzb3VyY2VzIjpbIi9Vc2Vycy9qdWxpZXRhaGFiaWYvRGVza3RvcC9hUXVpZW5EZWpvUHJpbWVyby9saWIvc3VwYWJhc2UvY29uZmlnLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBzdXBhYmFzZUNvbmZpZyA9IHtcbiAgdXJsOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwgfHwgcHJvY2Vzcy5lbnYuU1VQQUJBU0VfVVJMIHx8IFwiXCIsXG4gIGFub25LZXk6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIHx8IHByb2Nlc3MuZW52LlNVUEFCQVNFX0FOT05fS0VZIHx8IFwiXCIsXG4gIHNlcnZpY2VSb2xlS2V5OiBwcm9jZXNzLmVudi5TVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZIHx8IFwiXCIsXG4gIGNvb2tpZU9wdGlvbnM6IHtcbiAgICAvLyBBZGQgY29va2llIG9wdGlvbnNcbiAgICBzYlNhbWVTaXRlOiBcImxheFwiLFxuICAgIHNiU2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIsXG4gICAgc2JEb21haW46IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IFwiLnlvdXJkb21haW4uY29tXCIgOiB1bmRlZmluZWQsIC8vIFJlcGxhY2Ugd2l0aCB5b3VyIGRvbWFpblxuICAgIHNiUGF0aDogXCIvXCIsXG4gIH0sXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVN1cGFiYXNlQ29uZmlnKCkge1xuICBpZiAoIXN1cGFiYXNlQ29uZmlnLnVybCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCBvIFNVUEFCQVNFX1VSTCBubyBlc3TDoSBkZWZpbmlkb1wiKVxuICB9XG4gIGlmICghc3VwYWJhc2VDb25maWcuYW5vbktleSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIG8gU1VQQUJBU0VfQU5PTl9LRVkgbm8gZXN0w6EgZGVmaW5pZG9cIilcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuIl0sIm5hbWVzIjpbInN1cGFiYXNlQ29uZmlnIiwidXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsIlNVUEFCQVNFX1VSTCIsImFub25LZXkiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSIsIlNVUEFCQVNFX0FOT05fS0VZIiwic2VydmljZVJvbGVLZXkiLCJTVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZIiwiY29va2llT3B0aW9ucyIsInNiU2FtZVNpdGUiLCJzYlNlY3VyZSIsInNiRG9tYWluIiwidW5kZWZpbmVkIiwic2JQYXRoIiwidmFsaWRhdGVTdXBhYmFzZUNvbmZpZyIsIkVycm9yIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase/config.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fauth%2Fcallback%2Froute&page=%2Fauth%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fauth%2Fcallback%2Froute.ts&appDir=%2FUsers%2Fjulietahabif%2FDesktop%2FaQuienDejoPrimero%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fjulietahabif%2FDesktop%2FaQuienDejoPrimero&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fauth%2Fcallback%2Froute&page=%2Fauth%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fauth%2Fcallback%2Froute.ts&appDir=%2FUsers%2Fjulietahabif%2FDesktop%2FaQuienDejoPrimero%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fjulietahabif%2FDesktop%2FaQuienDejoPrimero&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_julietahabif_Desktop_aQuienDejoPrimero_app_auth_callback_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/auth/callback/route.ts */ \"(rsc)/./app/auth/callback/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/auth/callback/route\",\n        pathname: \"/auth/callback\",\n        filename: \"route\",\n        bundlePath: \"app/auth/callback/route\"\n    },\n    resolvedPagePath: \"/Users/julietahabif/Desktop/aQuienDejoPrimero/app/auth/callback/route.ts\",\n    nextConfigOutput,\n    userland: _Users_julietahabif_Desktop_aQuienDejoPrimero_app_auth_callback_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhdXRoJTJGY2FsbGJhY2slMkZyb3V0ZSZwYWdlPSUyRmF1dGglMkZjYWxsYmFjayUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmF1dGglMkZjYWxsYmFjayUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmp1bGlldGFoYWJpZiUyRkRlc2t0b3AlMkZhUXVpZW5EZWpvUHJpbWVybyUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZqdWxpZXRhaGFiaWYlMkZEZXNrdG9wJTJGYVF1aWVuRGVqb1ByaW1lcm8maXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ3dCO0FBQ3JHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvanVsaWV0YWhhYmlmL0Rlc2t0b3AvYVF1aWVuRGVqb1ByaW1lcm8vYXBwL2F1dGgvY2FsbGJhY2svcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXV0aC9jYWxsYmFjay9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXV0aC9jYWxsYmFja1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hdXRoL2NhbGxiYWNrL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2p1bGlldGFoYWJpZi9EZXNrdG9wL2FRdWllbkRlam9QcmltZXJvL2FwcC9hdXRoL2NhbGxiYWNrL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fauth%2Fcallback%2Froute&page=%2Fauth%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fauth%2Fcallback%2Froute.ts&appDir=%2FUsers%2Fjulietahabif%2FDesktop%2FaQuienDejoPrimero%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fjulietahabif%2FDesktop%2FaQuienDejoPrimero&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions","vendor-chunks/cookie"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fauth%2Fcallback%2Froute&page=%2Fauth%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fauth%2Fcallback%2Froute.ts&appDir=%2FUsers%2Fjulietahabif%2FDesktop%2FaQuienDejoPrimero%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fjulietahabif%2FDesktop%2FaQuienDejoPrimero&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();