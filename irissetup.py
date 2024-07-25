
import iris

# switch namespace to the %SYS namespace
iris.system.Process.SetNamespace("%SYS")

# set credentials to not expire
iris.cls('Security.Users').UnExpireUserPasswords("*")

# assert iris.ipm('load /usr/irissys/csp/sheltershare -v')

num_imported=0
imported_status=iris.cls("Security.Applications").Import("/usr/irissys/csp/sheltershare/app.xml", num_imported,0)
print("status:")
print(imported_status)
print("num_imported:")
print(num_imported)